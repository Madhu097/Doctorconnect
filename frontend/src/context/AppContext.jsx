import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getDoctorEmail, getDoctorImage } from "../utils/doctorImage";
import { getFriendlyApiError } from "../utils/apiError";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(false);

  // Fetch doctors
  const getDoctorsData = async (silent = false) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/list?updatedAt=${Date.now()}`,
        { headers: { "Cache-Control": "no-cache" } },
      );

      if (data.success) {
        setDoctors(data.doctors.map((doctor) => ({
          ...doctor,
          email: getDoctorEmail(doctor),
          image: getDoctorImage(doctor),
        })));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("GET DOCTORS ERROR:", error);
      if (!silent) toast.error(getFriendlyApiError(error, "Unable to load doctors. Please try again."));
    }
  };
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("GET DOCTORS ERROR:", error);
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
      toast.error(getFriendlyApiError(error, "Unable to load your profile. Please try again."));
    }
  };

  // Register user
  const registerUser = async (name, email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Registration successful");
        return true;
      }

      toast.error(data.message || "Registration failed");
      return false;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      toast.error(getFriendlyApiError(error, "Registration failed. Please try again."));
      return false;
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Login successful");
        return true;
      }

      toast.error(data.message || "Login failed");
      return false;
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);

      toast.error(getFriendlyApiError(error, "Login failed. Please check your details and try again."));
      return false;
    }
  };

  // Logout user
  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.info("Logged out successfully");
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    registerUser,
    loginUser,
    logoutUser,
    userData,
    setUserData,
    loadUserProfileData,
  };

  useEffect(() => {
    getDoctorsData();
    const refreshDoctors = () => {
      if (document.visibilityState === "visible") getDoctorsData(true);
    };
    const intervalId = window.setInterval(refreshDoctors, 3000);
    document.addEventListener("visibilitychange", refreshDoctors);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshDoctors);
    };
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
