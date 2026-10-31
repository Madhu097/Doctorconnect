import axios from "axios";
import { toast } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import { getDoctorImage } from "../../../frontend/src/utils/doctorImage";
import { getFriendlyApiError } from "../utils/apiError";

export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    () => localStorage.getItem("aToken") || "",
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData]= useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getAllDoctors = async (silent = false) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } },
      );
      if (data.success) {
        setDoctors(data.doctors.map((doctor) => ({
          ...doctor,
          image: getDoctorImage(doctor),
        })));
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (!silent) toast.error(getFriendlyApiError(error, "Unable to load doctors. Please try again."));
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const doctor = doctors.find((item) => item._id === docId);
      if (!doctor) {
        toast.error("Doctor not found");
        return false;
      }

      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId, available: !doctor.available },
        { headers: { aToken } },
      );
      if (data.success) {
        if (data.doctor.available) {
          toast.success("Doctor is now available");
        } else {
          toast.error("Doctor is now unavailable");
        }
        setDoctors((current) =>
          current.map((item) =>
            item._id === docId
              ? { ...item, available: data.doctor.available }
              : item,
          ),
        );
        return true;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getFriendlyApiError(error, "Unable to update doctor availability. Please try again."));
    }
    return false;
  };

  const updateDoctor = async (doctorData) => {
    try {
      const payload = {
        docId: doctorData.docId || doctorData._id,
        name: doctorData.name,
        degree: doctorData.degree,
        speciality: doctorData.speciality,
        experience: doctorData.experience,
        about: doctorData.about,
        fees: doctorData.fees,
        address: doctorData.address,
      };
      const { data } = await axios.put(
        backendUrl + "/api/admin/update-doctor",
        payload,
        { headers: { aToken } },
      );
      if (data.success) {
        const updatedDoctor = {
          ...data.doctor,
          image: getDoctorImage(data.doctor),
        };
        setDoctors((current) =>
          current.map((doctor) =>
            doctor._id === updatedDoctor._id ? updatedDoctor : doctor,
          ),
        );
        toast.success(data.message);
        return true;
      }
      toast.error(data.message);
    } catch (error) {
      toast.error(getFriendlyApiError(error, "Unable to update doctor details. Please try again."));
    }
    return false;
  };

  const changeDoctorPassword = async (docId, password) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-doctor-password",
        { docId, password },
        { headers: { aToken } },
      );
      if (data.success) {
        toast.success(data.message);
        return true;
      }
      toast.error(data.message);
    } catch (error) {
      toast.error(getFriendlyApiError(error, "Unable to change the doctor password. Please try again."));
    }
    return false;
  };

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments.map((appointment) => ({
          ...appointment,
          docData: {
            ...appointment.docData,
            image: getDoctorImage(appointment.docData),
          },
        })));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getFriendlyApiError(error, "Unable to load appointments. Please try again."));
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } },
      );
      if (data.success) {
        toast.error(data.message);
        await getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(getFriendlyApiError(error, "Unable to cancel the appointment. Please try again."));
    }
  };

  const getDashData = async()=>{
    try {
      const {data}= await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}})
      if (data.success) {
        setDashData({
          ...data.dashData,
          latestAppointments: data.dashData.latestAppointments.map((appointment) => ({
            ...appointment,
            docData: {
              ...appointment.docData,
              image: getDoctorImage(appointment.docData),
            },
          })),
        });
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(getFriendlyApiError(error, "Unable to load dashboard data. Please try again."));
    }
  }
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    updateDoctor,
    changeDoctorPassword,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,getDashData
  };

  useEffect(() => {
    if (!aToken) return undefined;
    const refreshDoctors = () => {
      if (document.visibilityState === "visible") getAllDoctors(true);
    };
    const intervalId = window.setInterval(refreshDoctors, 15000);
    document.addEventListener("visibilitychange", refreshDoctors);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshDoctors);
    };
  }, [aToken]);

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
