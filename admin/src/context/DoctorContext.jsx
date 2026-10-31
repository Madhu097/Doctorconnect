import { useEffect, useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();
const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(
    () => localStorage.getItem("dToken") || "",
  );
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [dashData, setDashData] = useState(null);
  const authHeaders = (token = dToken) => ({
    dtoken: token,
    Authorization: `Bearer ${token}`,
  });
  const getAppointments = async (token = dToken) => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: {
            dtoken: token,
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getDoctorDashboard = async (token = dToken) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
        headers: authHeaders(token),
      });
      if (data.success) setDashData(data.dashData);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDoctorProfile = async (token = dToken) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: authHeaders(token),
      });
      if (data.success) setDoctor(data.doctor);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (available) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/doctor/availability`,
        { available },
        { headers: authHeaders() },
      );
      if (data.success) {
        setDoctor((current) => ({ ...current, available: data.doctor.available }));
        if (data.doctor.available) {
          toast.success("You are now available");
        } else {
          toast.error("You are now unavailable");
        }
        return true;
      }
      toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    return false;
  };

  const updateDoctorProfile = async (profile) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/doctor/profile`, profile, {
        headers: authHeaders(),
      });
      if (data.success) {
        setDoctor(data.doctor);
        toast.success(data.message);
      } else toast.error(data.message);
      return data.success;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        {
          headers: {
            dtoken: dToken,
            Authorization: `Bearer ${dToken}`,
          },
        },
      );
      if (data.success) {
        toast.success(data.message);
       await  getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        {
          headers: {
            dtoken: dToken,
            Authorization: `Bearer ${dToken}`,
          },
        },
      );
      if (data.success) {
        toast.success(data.message);
        await         getAppointments(dToken);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    doctor,
    dashData,
    setAppointments,
    getAppointments,
    getDoctorDashboard,
    getDoctorProfile,
    changeAvailability,
    updateDoctorProfile,
    completeAppointment,
    cancelAppointment
  };

  useEffect(() => {
    if (!dToken) return undefined;
    const refreshAppointments = () => {
      if (document.visibilityState === "visible") {
        getAppointments(dToken);
        getDoctorDashboard(dToken);
      }
    };
    const intervalId = window.setInterval(refreshAppointments, 15000);
    document.addEventListener("visibilitychange", refreshAppointments);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshAppointments);
    };
  }, [dToken]);

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};
export default DoctorContextProvider;
