import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
  try {
    const available = req.body.available;
    if (typeof available !== "boolean") {
      return res.status(400).json({ success: false, message: "Availability must be a boolean" });
    }
    const doctor = await doctorModel.findByIdAndUpdate(
      req.docId,
      { available },
      { new: true },
    ).select("_id available");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({
      success: true,
      message: available ? "You are now available" : "You are now unavailable",
      doctor,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    const doctors = await doctorModel
      .find({})
      .select("-password")
      .sort({ date: 1 });
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const doctor = await doctorModel.findOne({ email: normalizedEmail });
    if (!doctor) {
      return res.json({ success: false, message: "Invalid Credientials" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: doctor._id.toString(), role: "doctor" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credientials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to get doctor appointmets for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = String(req.docId);
    const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === String(docId)) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//api to cancel appointment completed for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointmentData =await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId === String(docId)) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cacellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorDashboard = async (req, res) => {
  try {
    const docId = String(req.docId);
    const appointments = await appointmentModel
      .find({ docId })
      .sort({ date: -1 })
      .lean();
    const activeAppointments = appointments.filter((item) => !item.cancelled);
    const patients = new Set(activeAppointments.map((item) => item.userId));

    res.json({
      success: true,
      dashData: {
        appointments: activeAppointments.length,
        patients: patients.size,
        completed: activeAppointments.filter((item) => item.isCompleted).length,
        pending: activeAppointments.filter((item) => !item.isCompleted).length,
        latestAppointments: activeAppointments.slice(0, 5),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.docId).select("-password");
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { name, degree, speciality, experience, about, fees, address, available } =
      req.body;
    const doctor = await doctorModel.findById(req.docId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const updates = {
      name: name?.trim(),
      degree: degree?.trim(),
      speciality: speciality?.trim(),
      experience: experience?.trim(),
      about: about?.trim(),
      fees: Number(fees),
      address,
      available: Boolean(available),
    };
    if (!updates.name || !updates.degree || !updates.speciality || !updates.experience ||
        !updates.about || !Number.isFinite(updates.fees) || updates.fees < 0 || !updates.address) {
      return res.status(400).json({ success: false, message: "Please provide valid profile details" });
    }

    const updatedDoctor = await doctorModel
      .findByIdAndUpdate(req.docId, updates, { new: true, runValidators: true })
      .select("-password");
    res.json({ success: true, message: "Profile updated successfully", doctor: updatedDoctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  getDoctorProfile,
  updateDoctorProfile,
};
