import express from "express";
import {
  appointmentsDoctor,
  doctorList,
  changeAvailability,
  loginDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  getDoctorProfile,
  updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.put("/availability", authDoctor, changeAvailability);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, getDoctorProfile);
doctorRouter.put("/profile", authDoctor, updateDoctorProfile);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);

export default doctorRouter;
