import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] px-4 py-7 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Doctor Workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#172B4D] sm:text-3xl">
              Appointments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your patient visits and appointment schedule.
            </p>
          </div>

          {/* TOTAL APPOINTMENTS */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Total Appointments
              </p>

              <p className="text-xl font-bold text-[#172B4D]">
                {appointments.length}
              </p>
            </div>
          </div>
        </div>

        {/* APPOINTMENT CONTAINER */}
        <div className="w-full overflow-hidden rounded-2xl border border-[#E8EDF3] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
          {/* TABLE HEADER */}
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="text-base font-bold text-[#172B4D]">
                Patient Appointments
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Overview of your scheduled patient visits
              </p>
            </div>

            <span className="w-fit rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
              {appointments.length} Records
            </span>
          </div>

          {/* DESKTOP COLUMN HEADERS */}
          <div className="hidden grid-cols-[45px_minmax(160px,1.5fr)_minmax(90px,0.9fr)_65px_minmax(130px,1.2fr)_100px_120px] gap-4 bg-[#F9FAFC] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.10em] text-slate-400 xl:grid">
            <p>No.</p>
            <p>Patient Details</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Appointment Date</p>
            <p>Consultation Fee</p>
            <p className="text-center">Actions</p>
          </div>

          {/* APPOINTMENT ROWS */}
          {appointments.map((item, index) => (
            <div
              key={item._id}
              className="grid grid-cols-1 gap-4 border-b border-slate-100 px-5 py-5 transition-colors duration-200 last:border-0 hover:bg-[#FAFCFE] sm:px-7 xl:grid-cols-[45px_minmax(160px,1.5fr)_minmax(90px,0.9fr)_65px_minmax(130px,1.2fr)_100px_120px] xl:items-center xl:gap-4"
            >
              {/* NUMBER */}
              <p className="hidden text-xs font-semibold text-slate-400 xl:block">
                {String(index + 1).padStart(2, "0")}
              </p>

              {/* PATIENT */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={item.userData?.image}
                    alt={item.userData?.name || "Patient"}
                    className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                  />

                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#263B5A]">
                    {item.userData?.name}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Patient #{String(index + 1).padStart(3, "0")}
                  </p>
                </div>
              </div>

              {/* PAYMENT */}
              <div className="flex items-center justify-between xl:block">
                <span className="text-xs text-slate-400 xl:hidden">
                  Payment Method
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${
                    item.payment
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.payment ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />

                  {item.payment ? "Online" : "Cash"}
                </span>
              </div>

              {/* AGE */}
              <div className="flex items-center justify-between xl:block">
                <span className="text-xs text-slate-400 xl:hidden">
                  Patient Age
                </span>

                <p className="text-sm font-semibold text-slate-600">
                  {calculateAge(item.userData?.dob)} yrs
                </p>
              </div>

              {/* DATE AND TIME */}
              <div className="flex items-center justify-between xl:block">
                <span className="text-xs text-slate-400 xl:hidden">
                  Appointment
                </span>

                <div className="text-right xl:text-left">
                  <p className="text-sm font-semibold text-[#344563]">
                    {slotDateFormat(item.slotDate)}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">{item.slotTime}</p>
                </div>
              </div>

              {/* FEES */}
              <div className="flex items-center justify-between xl:block">
                <span className="text-xs text-slate-400 xl:hidden">
                  Consultation Fee
                </span>

                <p className="text-sm font-bold text-[#263B5A]">
                  {currency}
                  {item.amount}
                </p>
              </div>

              {/* STATUS AND ACTIONS */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4 xl:justify-center xl:border-0 xl:pt-0">
                {item.cancelled ? (
                  <span className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="rounded-md bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">
                    Completed
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-medium text-slate-400 xl:hidden">
                      Manage Appointment
                    </span>

                    <div className="flex shrink-0 items-center justify-center gap-2">
                      {/* CANCEL */}
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-10 cursor-pointer transition-transform hover:scale-110"
                        src={assets.cancel_icon}
                        alt="Cancel"
                        title="Cancel Appointment"
                      />

                      {/* COMPLETE */}
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-10 cursor-pointer transition-transform hover:scale-110"
                        src={assets.tick_icon}
                        alt="Complete"
                        title="Complete Appointment"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {appointments.length === 0 && (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                <svg
                  className="h-8 w-8 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1-1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
                  />
                </svg>
              </div>

              <h3 className="text-base font-bold text-[#263B5A]">
                No appointments yet
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                Your upcoming patient appointments will appear here once they
                are scheduled.
              </p>
            </div>
          )}

          {/* FOOTER */}
          {appointments.length > 0 && (
            <div className="border-t border-slate-100 bg-[#FCFDFE] px-5 py-4 sm:px-7">
              <p className="text-xs text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-600">
                  {appointments.length}
                </span>{" "}
                patient appointments
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
