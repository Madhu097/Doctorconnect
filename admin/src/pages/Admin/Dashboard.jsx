import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const {slotDateFormat} = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, []);

  return (
    dashData && (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-8">
        {/* Dashboard Statistics */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Overview of your hospital management system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {/* Doctors Card */}
          <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-blue-50 shrink-0">
              <img
                className="w-9 sm:w-10"
                src={assets.doctor_icon}
                alt=""
              />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {dashData.doctors}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-green-50 shrink-0">
              <img
                className="w-9 sm:w-10"
                src={assets.appointment_icon}
                alt=""
              />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {dashData.appointments}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-purple-50 shrink-0">
              <img
                className="w-9 sm:w-10"
                src={assets.patients_icon}
                alt=""
              />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                {dashData.patients}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 shrink-0">
                <img
                  className="w-6 h-6"
                  src={assets.list_icon}
                  alt=""
                />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Latest Bookings
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Recent appointment activity
                </p>
              </div>
            </div>

            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-2 rounded-lg self-start sm:self-auto">
              {dashData.latestAppointments.length} Appointments
            </span>
          </div>

          {/* Appointment List */}
          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Doctor Information */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />

                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {item.docData.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Appointment Date: {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                {/* Appointment Status and Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:min-w-36">
                  {item.cancelled ? (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-red-50 text-red-600 text-xs font-semibold border border-red-100 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Cancelled
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 h-10 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 hover:shadow-sm transition-all duration-200"
                      title="Cancel appointment"
                      aria-label={`Cancel appointment for ${item.userData.name}`}
                    >
                      <img
                        className="w-5 h-5"
                        src={assets.cancel_icon}
                        alt=""
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {dashData.latestAppointments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <img
                    className="w-8 h-8 opacity-50"
                    src={assets.list_icon}
                    alt=""
                  />
                </div>
                <p className="text-gray-700 font-semibold">
                  No appointments yet
                </p>
                <p className="text-sm text-gray-400 mt-1 text-center">
                  New appointments will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;

