import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorProfile = () => {
  const { dToken, doctor, getDoctorProfile, updateDoctorProfile, changeAvailability } = useContext(DoctorContext);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (dToken) getDoctorProfile(dToken);
  }, [dToken]);

  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name,
        degree: doctor.degree,
        speciality: doctor.speciality,
        experience: doctor.experience,
        about: doctor.about,
        fees: doctor.fees,
        available: doctor.available,
        address: { line1: doctor.address?.line1 || "", line2: doctor.address?.line2 || "" },
      });
    }
  }, [doctor]);

  if (!form) return <div className="p-8 text-slate-500">Loading profile...</div>;
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    await updateDoctorProfile(form);
  };

  const toggleAvailability = async () => {
    const updated = await changeAvailability(!form.available);
    if (updated) update("available", !form.available);
  };

  return (
    <main className="min-h-screen w-full bg-[#F6F8FB] p-5 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-[#172B4D]">My Profile</h1>
        <p className="mt-2 text-sm text-slate-500">Keep your professional information up to date.</p>

        <form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-6">
            <img className="h-20 w-20 rounded-2xl object-cover" src={doctor.image} alt={doctor.name} />
            <div>
              <p className="text-xl font-bold text-[#172B4D]">{doctor.name}</p>
              <p className="mt-1 text-sm text-slate-500">{doctor.email}</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              ["name", "Full name"],
              ["degree", "Degree"],
              ["speciality", "Speciality"],
              ["experience", "Experience"],
              ["fees", "Consultation fee"],
            ].map(([field, label]) => (
              <label key={field} className="text-sm font-medium text-slate-600">
                {label}
                <input
                  required
                  type={field === "fees" ? "number" : "text"}
                  value={form[field]}
                  onChange={(event) => update(field, event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500"
                />
              </label>
            ))}
          </div>

          <label className="mt-5 block text-sm font-medium text-slate-600">
            About
            <textarea required rows="5" value={form.about} onChange={(event) => update("about", event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500" />
          </label>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {["line1", "line2"].map((field) => (
              <label key={field} className="text-sm font-medium text-slate-600">
                Address {field === "line1" ? "line 1" : "line 2"}
                <input value={form.address[field]} onChange={(event) => setForm((current) => ({
                  ...current, address: { ...current.address, [field]: event.target.value },
                }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-emerald-500" />
              </label>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Appointment availability</p>
              <p className={`mt-1 text-xs ${form.available ? "text-emerald-600" : "text-rose-600"}`}>
                {form.available ? "Available for new appointments" : "Unavailable for new appointments"}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleAvailability}
              className={`relative h-7 w-12 rounded-full transition ${form.available ? "bg-emerald-500" : "bg-slate-300"}`}
              aria-label={form.available ? "Set unavailable" : "Set available"}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${form.available ? "left-6" : "left-1"}`} />
            </button>
          </div>
          <button type="submit" className="mt-8 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Save profile
          </button>
        </form>
      </div>
    </main>
  );
};

export default DoctorProfile;
