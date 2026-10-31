import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API: Add Doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // 1. Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      fees === undefined ||
      fees === "" ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details.",
      });
    }

    // 2. Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // 3. Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // 4. Validate image
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please select a doctor image.",
      });
    }

    // 5. Validate fees
    const doctorFees = Number(fees);

    if (!Number.isFinite(doctorFees) || doctorFees < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter valid consultation fees.",
      });
    }

    // 6. Parse address
    let parsedAddress;

    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid address format.",
      });
    }

    // 7. Hash doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 8. Upload image to Cloudinary
    let imageUpload;

    try {
      imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
    } catch (error) {
      console.error("CLOUDINARY UPLOAD FAILED:");
      console.error("Message:", error.message);
      console.error("HTTP code:", error.http_code);
      console.dir(error, { depth: 5 });

      return res.status(502).json({
        success: false,
        message: "Doctor image upload failed. Please try again.",
      });
    }

    // 9. Prepare doctor document
    const doctorData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      image: imageUpload.secure_url,
      speciality,
      degree,
      experience,
      about,
      available: true,
      fees: doctorFees,
      address: parsedAddress,
      date: Date.now(),
    };

    // 10. Save doctor to MongoDB
    const newDoctor = new doctorModel(doctorData);
    const savedDoctor = await newDoctor.save();

    console.log("Doctor saved successfully:", savedDoctor._id);

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully.",
      doctorId: savedDoctor._id,
    });
  } catch (error) {
    console.error("ADD DOCTOR ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A doctor with this email already exists.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add doctor. Please try again.",
    });
  }
};

// API: Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = email.trim().toLowerCase();
    if (
      adminEmail === process.env.ADMIN_EMAIL?.trim().toLowerCase() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing from the environment.");
      }

      const token = jwt.sign({ email: adminEmail, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        token,
        message: "Admin login successful.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials.",
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
};
// Api to get all doctors for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password").sort({ date: 1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } 
};

const updateDoctor = async (req, res) => {
  try {
    const { docId, name, degree, speciality, experience, about, fees, address } = req.body;
    const doctorFees = Number(fees);
    if (
      !docId ||
      !name?.trim() ||
      !degree?.trim() ||
      !speciality?.trim() ||
      !experience?.trim() ||
      !about?.trim() ||
      !Number.isFinite(doctorFees) ||
      doctorFees < 0 ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid doctor details",
      });
    }

    const doctor = await doctorModel.findByIdAndUpdate(
      docId,
      {
        name: name.trim(),
        degree: degree.trim(),
        speciality: speciality.trim(),
        experience: experience.trim(),
        about: about.trim(),
        fees: doctorFees,
        address,
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    return res.json({
      success: true,
      message: "Doctor details updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("UPDATE DOCTOR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor details",
    });
  }
};

//change Availability
const changeAvailability = async (req, res) => {
  try {
    const { docId, available } = req.body;

    if (!docId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await doctorModel.findById(docId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (typeof available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Availability must be a boolean",
      });
    }

    doctor.available = available;
    await doctor.save();

    return res.json({
      success: true,
      message: "Doctor availability updated successfully",
      doctor: {
        _id: doctor._id,
        available: doctor.available,
      },
    });
  } catch (error) {
    console.error("CHANGE AVAILABILITY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor availability",
    });
  }
};

const changeDoctorPassword = async (req, res) => {
  try {
    const { docId, password } = req.body;
    if (!docId || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and a password of at least 8 characters are required",
      });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    doctor.password = await bcrypt.hash(password, 10);
    await doctor.save();
    return res.json({ success: true, message: "Doctor password updated successfully" });
  } catch (error) {
    console.error("CHANGE DOCTOR PASSWORD ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to update doctor password" });
  }
};

// api to get all appointment list
const appointmentAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//api for appointment cancellataion

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    //releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);
    let slots_booked = doctorData.slots_booked;
    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get dashboard data for admin panel

const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({}).sort({ date: -1 });

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  updateDoctor,
  changeAvailability,
  changeDoctorPassword,
  appointmentAdmin,
  appointmentCancel,
  adminDashboard,
};
