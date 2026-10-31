import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/images/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THu", "FRI", "SAT"];
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const dateSlotsRef = useRef(null);
  const timeSlotsRef = useRef(null);
  const scrollSlots = (ref, direction) => {
    ref.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  };
  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };
  const getAvailableSlots = async () => {
    setDocSlots([]);
    //getting current date
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      //settings end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);
      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() >= 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          //add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        //Increment current time by 30 mins
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!docInfo?.available) {
      toast.error("This doctor is currently unavailable");
      return;
    }
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }
    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/myappointments");
      } else {
        toast.error(
          data.message === "Slot not available"
            ? "This time slot is no longer available. Please choose another."
            : "We couldn't book this appointment. Please try again.",
        );
      }
    } catch (error) {
      console.error("APPOINTMENT BOOKING ERROR:", error);
      toast.error("We couldn't book this appointment. Please try again.");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);
  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);
  return (
    docInfo && (
      <div>
        {/*--------Doctor Details-----*/}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/*----Doc Info name,degree...----*/}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">Email:</span>{" "}
              {docInfo.email || "Email not available"}
            </p>
            {/*----doctors about----*/}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol} {docInfo.fees}
              </span>{" "}
            </p>
          </div>
        </div>
        {/*----- booking slots-------*/}
        <div className="mt-6 font-medium text-gray-700 sm:ml-72 sm:pl-4">
          <p className="mb-1">Booking Slots</p>
          <div className="relative mt-4">
            <button type="button" onClick={() => scrollSlots(dateSlotsRef, -1)} className="slot-scroll-button left-0" aria-label="Show previous dates">
              &#8249;
            </button>
            <div ref={dateSlotsRef} className="appointment-slots-scroll flex gap-3 items-center overflow-x-auto px-9 py-1">
              {docSlots.length &&
                docSlots.map((item, index) => (
                  <button
                    type="button"
                    onClick={() => setSlotIndex(index)}
                    className={`min-w-20 shrink-0 rounded-xl px-3 py-4 text-center text-sm transition-all ${slotIndex === index ? "bg-primary text-white shadow-md" : "border border-gray-200 bg-white hover:border-primary hover:text-primary"}`}
                    key={index}
                  >
                    <span className="block text-xs font-medium">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</span>
                    <span className="mt-1 block text-lg">{item[0] && item[0].datetime.getDate()}</span>
                  </button>
                ))}
            </div>
            <button type="button" onClick={() => scrollSlots(dateSlotsRef, 1)} className="slot-scroll-button right-0" aria-label="Show next dates">
              &#8250;
            </button>
          </div>
          <div className="relative mt-5">
            <button type="button" onClick={() => scrollSlots(timeSlotsRef, -1)} className="slot-scroll-button left-0" aria-label="Show earlier times">
              &#8249;
            </button>
            <div ref={timeSlotsRef} className="appointment-slots-scroll flex items-center gap-2 overflow-x-auto px-9 py-1">
              {docSlots.length &&
                docSlots[slotIndex].map((item, index) => (
                  <button
                    type="button"
                    onClick={() => setSlotTime(item.time)}
                    className={`shrink-0 rounded-full px-5 py-2 text-sm transition-all ${item.time === slotTime ? "bg-primary text-white shadow-md" : "border border-gray-300 bg-white text-gray-500 hover:border-primary hover:text-primary"}`}
                    key={index}
                  >
                    {item.time.toLowerCase()}
                  </button>
                ))}
            </div>
            <button type="button" onClick={() => scrollSlots(timeSlotsRef, 1)} className="slot-scroll-button right-0" aria-label="Show later times">
              &#8250;
            </button>
          </div>
          <button
            onClick={bookAppointment}
            disabled={!docInfo.available}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-5 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {docInfo.available ? "Book an appointment" : "Doctor unavailable"}
          </button>
        </div>
        {/*--------Listing Related Doctors------*/}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
