import express from "express";
import { addDoctor, allDoctors, updateDoctor, loginAdmin ,changeAvailability, changeDoctorPassword, appointmentAdmin, appointmentCancel, adminDashboard} from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin,allDoctors);
adminRouter.put("/update-doctor", authAdmin, updateDoctor);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/change-doctor-password", authAdmin, changeDoctorPassword);
adminRouter.get("/appointments", authAdmin, appointmentAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
