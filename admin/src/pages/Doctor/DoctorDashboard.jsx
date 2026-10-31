import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, getDoctorDashboard } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getDoctorDashboard(dToken);
  }, [dToken]);

  if (!dashData) return <div className="p-8 text-slate-500">Loading dashboard...</div>;

  return (
    <main className="min-h-screen w-full bg-[#F6F8FB] p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-[#172B4D]">Doctor Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">Your practice overview and upcoming visits.</p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Appointments", dashData.appointments, "bg-blue-50 text-blue-700"],
            ["Patients", dashData.patients, "bg-purple-50 text-purple-700"],
            ["Completed", dashData.completed, "bg-emerald-50 text-emerald-700"],
            ["Pending", dashData.pending, "bg-amber-50 text-amber-700"],
          ].map(([label, value, style]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${style}`}>{label}</p>
              <p className="mt-5 text-3xl font-bold text-[#172B4D]">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="font-bold text-[#172B4D]">Recent Appointments</h2>
          </div>
          {dashData.latestAppointments.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate-400">No active appointments yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashData.latestAppointments.map((item) => (
                <div key={item._id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <img className="h-11 w-11 rounded-full object-cover" src={item.userData?.image} alt="" />
                    <div>
                      <p className="font-semibold text-slate-700">{item.userData?.name}</p>
                      <p className="text-xs text-slate-400">{slotDateFormat(item.slotDate)} at {item.slotTime}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-600">{currency}{item.amount}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default DoctorDashboard;
