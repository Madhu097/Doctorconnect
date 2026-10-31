import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full min-w-0 max-w-7xl mx-auto p-3 sm:p-5 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
            All Appointments
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage and monitor all patient appointments.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>

          <span className="text-xs sm:text-sm font-medium text-blue-700">
            {appointments.length} Appointments
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Desktop / Tablet Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-4 font-semibold">#</th>
                  <th className="px-5 py-4 font-semibold">Patient</th>
                  <th className="px-5 py-4 font-semibold">Age</th>
                  <th className="px-5 py-4 font-semibold">Date & Time</th>
                  <th className="px-5 py-4 font-semibold">Doctor</th>
                  <th className="px-5 py-4 font-semibold">Fees</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {appointments.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-blue-50/40 transition-colors duration-200"
                  >
                    {/* Number */}
                    <td className="px-5 py-4 text-gray-400 font-medium">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <img
                          className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
                          src={item.userData.image}
                          alt=""
                        />

                        <span className="font-semibold text-gray-800">
                          {item.userData.name}
                        </span>
                      </div>
                    </td>
                    {/* Age */}
                    <td className="px-5 py-4 text-gray-600">
                      {calculateAge(item.userData.dob)}
                    </td>
                    {/* Date and Time */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700">
                        {slotDateFormat(item.slotDate)}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.slotTime}
                      </p>
                    </td>
                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <img
                          className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
                          src={item.docData.image}
                          alt=""
                        />

                        <span className="font-medium text-gray-700">
                          {item.docData.name}
                        </span>
                      </div>
                    </td>
                    {/* Fees */}
                    <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                      {currency}
                      {item.amount}
                    </td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      {item.cancelled ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
                          Cancelled
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => cancelAppointment(item._id)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 active:scale-95"
                          title="Cancel appointment"
                        >
                          <img
                            src={assets.cancel_icon}
                            alt=""
                            className="h-4 w-4"
                          />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Tablet Appointment Cards */}
        <div className="lg:hidden divide-y divide-gray-100">
          {appointments.map((item, index) => (
            <div
              key={item._id || index}
              className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors duration-200"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
                    src={item.userData.image}
                    alt=""
                  />

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base break-words">
                      {item.userData.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Appointment #{index + 1}
                    </p>
                  </div>
                </div>

                {item.cancelled ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-50 text-red-600 text-[11px] sm:text-xs font-semibold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Cancelled
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => cancelAppointment(item._id)}
                    className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:border-red-200 transition-all duration-200"
                    title="Cancel appointment"
                    aria-label={`Cancel appointment for ${item.userData.name}`}
                  >
                    <img className="w-5 h-5" src={assets.cancel_icon} alt="" />
                  </button>
                )}
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-6">
                {/* Age */}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Patient Age</p>

                  <p className="text-sm font-medium text-gray-700">
                    {calculateAge(item.userData.dob)}
                  </p>
                </div>

                {/* Fees */}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Consultation Fee</p>

                  <p className="text-sm font-semibold text-gray-800">
                    {currency}
                    {item.amount}
                  </p>
                </div>

                {/* Date */}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Appointment Date</p>

                  <p className="text-sm font-medium text-gray-700 break-words">
                    {slotDateFormat(item.slotDate)}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">{item.slotTime}</p>
                </div>

                {/* Doctor */}
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 mb-2">Assigned Doctor</p>

                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
                      src={item.docData.image}
                      alt=""
                    />

                    <p className="text-sm font-medium text-gray-700 break-words">
                      {item.docData.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-14 sm:py-20 px-5">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-gray-800">
              No appointments found
            </h2>

            <p className="text-sm text-gray-500 mt-2 max-w-sm">
              Patient appointments will appear here when bookings are available.
            </p>
          </div>
        )}

        {/* Footer */}
        {appointments.length > 0 && (
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {appointments.length}
              </span>{" "}
              appointment{appointments.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
