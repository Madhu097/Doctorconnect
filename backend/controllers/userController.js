import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import crypto from "crypto";

//api to register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    //validating email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    //validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password " });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentails" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, address, phone, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name?.trim() || !phone?.trim() || !gender || !address) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, gender, and address are required",
      });
    }
    await userModel.findByIdAndUpdate(userId, {
      name: name.trim(),
      phone: phone.trim(),
      address: JSON.parse(address),
      dob: dob || "Not Selected",
      gender,
    });
    if (imageFile) {
      // upload image  to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    if (
      !docId ||
      !/^\d{1,2}_\d{1,2}_\d{4}$/.test(slotDate || "") ||
      !/^\d{1,2}:\d{2}\s[AP]M$/i.test(slotTime || "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid appointment date and time",
      });
    }

    const doctor = await doctorModel.findById(docId).select("-password");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    if (!doctor.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    const slotKey = `slots_booked.${slotDate}`;
    const reservedDoctor = await doctorModel.findOneAndUpdate(
      {
        _id: docId,
        available: true,
        [slotKey]: { $ne: slotTime },
      },
      { $addToSet: { [slotKey]: slotTime } },
      { returnDocument: "after" },
    ).select("-password");

    if (!reservedDoctor) {
      return res.json({ success: false, message: "Slot not available" });
    }

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      await doctorModel.findByIdAndUpdate(docId, { $pull: { [slotKey]: slotTime } });
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const docData = reservedDoctor.toObject();
    delete docData.slots_booked;
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
    try {
      const newAppointment = new appointmentModel(appointmentData);
      await newAppointment.save();
    } catch (error) {
      await doctorModel.findByIdAndUpdate(docId, { $pull: { [slotKey]: slotTime } });
      throw error;
    }
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get user appointments for frontend my appointment page
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api to  cancel the appointment
const cancelAppointmetn = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    //verify appointment user
    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }
    if (appointmentData.cancelled) {
      return res.json({ success: true, message: "Appointment already cancelled" });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      await doctorModel.findByIdAndUpdate(docId, {
        $pull: { [`slots_booked.${slotDate}`]: slotTime },
      });
    }
    res.json({ success: true, message: "Appointment Cancled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Create a demo payment session for an existing appointment.
const createPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // Find the appointment
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Verify that the appointment belongs to the logged-in patient
    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // Reject cancelled appointments
    if (appointment.cancelled) {
      return res.status(400).json({
        success: false,
        message: "Cannot pay for a cancelled appointment",
      });
    }

    // Reject appointments that are already paid
    if (appointment.payment) {
      return res.status(400).json({
        success: false,
        message: "This appointment has already been paid for",
      });
    }

    // Always use the amount stored in MongoDB
    const amount = Number(appointment.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment amount",
      });
    }

    const paymentId = `demo_${crypto.randomUUID()}`;
    appointment.paymentId = paymentId;
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Demo payment session created",
      paymentId,
      amount,
    });
  } catch (error) {
    console.error("DEMO PAYMENT ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create payment session",
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId, paymentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    if (appointment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }
    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: "Cannot pay for a cancelled appointment" });
    }
    if (appointment.payment) {
      return res.status(409).json({ success: false, message: "This appointment has already been paid for" });
    }
    if (!paymentId || appointment.paymentId !== paymentId) {
      return res.status(400).json({ success: false, message: "Invalid payment session" });
    }

    appointment.payment = true;
    await appointment.save();
    return res.status(200).json({
      success: true,
      message: "Demo payment successful",
    });
  } catch (error) {
    console.error("DEMO PAYMENT CONFIRMATION ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to confirm payment",
    });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointmetn,
  createPayment,
  confirmPayment,
};
