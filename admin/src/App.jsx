import { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer} from "react-toastify";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import NotFound from "./pages/NotFound";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext)
  const isAdmin = Boolean(aToken);
  const isDoctor = Boolean(dToken) && !isAdmin;
  return isAdmin || isDoctor ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Admin Route */}
          <Route path="/" element={<Navigate to={isAdmin ? "/admin-dashboard" : "/doctor-dashboard"} replace />} />
          <Route path="/admin-dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/doctor-dashboard" replace />} />
          <Route path="/all-appointments" element={isAdmin ? <AllAppointments /> : <Navigate to="/doctor-dashboard" replace />} />
          <Route path="/add-doctor" element={isAdmin ? <AddDoctor /> : <Navigate to="/doctor-dashboard" replace />} />
          <Route path="/doctor-list" element={isAdmin ? <DoctorsList /> : <Navigate to="/doctor-dashboard" replace />} />

           {/* Doctor Route */}
          <Route path="/doctor-dashboard" element={isDoctor ? <DoctorDashboard /> : <Navigate to="/admin-dashboard" replace />} />
          <Route path="/doctor-appointments" element={isDoctor ? <DoctorAppointment /> : <Navigate to="/admin-dashboard" replace />} />
          <Route path="/doctor-profile" element={isDoctor ? <DoctorProfile /> : <Navigate to="/admin-dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
