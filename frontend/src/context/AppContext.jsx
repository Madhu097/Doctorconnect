import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getDoctorImage } from "../utils/doctorImage";

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
          image: getDoctorImage(doctor),
        })));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("GET DOCTORS ERROR:", error);
      if (!silent) toast.error("Failed to fetch doctors");
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
      toast.error("Failed to fetch doctors");
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

      toast.error(error.response?.data?.message || "Registration failed");
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

      toast.error(error.response?.data?.message || "Login failed");
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
