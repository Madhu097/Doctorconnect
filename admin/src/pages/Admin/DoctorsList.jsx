import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'

const DoctorsList = () => {
  const {doctors,aToken,getAllDoctors, changeAvailability, updateDoctor, changeDoctorPassword} = useContext(AdminContext)
  const [passwords, setPasswords] = useState({})
  const [editingDoctor, setEditingDoctor] = useState(null)
  useEffect(()=>{
    if(aToken){
      getAllDoctors()
    }
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden group' key={item._id}>
            <img className='h-56 w-full object-cover object-top bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt={item.name} />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <button
                  type="button"
                  onClick={() => changeAvailability(item._id)}
                  className={`relative h-6 w-11 rounded-full transition ${item.available ? "bg-emerald-500" : "bg-slate-300"}`}
                  aria-label={item.available ? "Set unavailable" : "Set available"}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${item.available ? "left-6" : "left-1"}`} />
                </button>
                <p className={item.available ? "text-green-600" : "text-red-600"}>
                  {item.available ? "Available" : "Unavailable"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDoctor({
                  ...item,
                  address: { line1: item.address?.line1 || "", line2: item.address?.line2 || "" },
                })}
                className="mt-3 w-full rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-700"
              >
                Edit details
              </button>
              <div className="mt-3 border-t border-indigo-100 pt-3">
                <input
                  type="password"
                  minLength="8"
                  placeholder="New password"
                  value={passwords[item._id] || ""}
                  onChange={(event) => setPasswords((current) => ({
                    ...current,
                    [item._id]: event.target.value,
                  }))}
                  className="w-full rounded border px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const changed = await changeDoctorPassword(item._id, passwords[item._id] || "");
                    if (changed) setPasswords((current) => ({ ...current, [item._id]: "" }));
                  }}
                  className="mt-2 w-full rounded bg-indigo-600 px-2 py-1 text-xs text-white"
                >
                  Change password
                </button>
              </div>
              {editingDoctor && (
                <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4">
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const saved = await updateDoctor(editingDoctor);
                      if (saved) setEditingDoctor(null);
                    }}
                    className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Edit doctor details</h2>
                      <button type="button" onClick={() => setEditingDoctor(null)} className="text-xl text-slate-500">×</button>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        ["name", "Name"],
                        ["degree", "Degree"],
                        ["speciality", "Speciality"],
                        ["experience", "Experience"],
                        ["fees", "Consultation fee"],
                      ].map(([field, label]) => (
                        <label key={field} className="text-sm text-slate-600">
                          {label}
                          <input
                            required
                            type={field === "fees" ? "number" : "text"}
                            value={editingDoctor[field] || ""}
                            onChange={(event) => setEditingDoctor((current) => ({ ...current, [field]: event.target.value }))}
                            className="mt-1 w-full rounded border px-3 py-2"
                          />
                        </label>
                      ))}
                    </div>
                    <label className="mt-3 block text-sm text-slate-600">
                      About
                      <textarea
                        required
                        rows="4"
                        value={editingDoctor.about || ""}
                        onChange={(event) => setEditingDoctor((current) => ({ ...current, about: event.target.value }))}
                        className="mt-1 w-full rounded border px-3 py-2"
                      />
                    </label>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {["line1", "line2"].map((field) => (
                        <label key={field} className="text-sm text-slate-600">
                          Address {field === "line1" ? "line 1" : "line 2"}
                          <input
                            value={editingDoctor.address?.[field] || ""}
                            onChange={(event) => setEditingDoctor((current) => ({
                              ...current,
                              address: { ...current.address, [field]: event.target.value },
                            }))}
                            className="mt-1 w-full rounded border px-3 py-2"
                          />
                        </label>
                      ))}
                    </div>
                    <button type="submit" className="mt-5 rounded bg-indigo-600 px-5 py-2 text-sm text-white">
                      Save changes
                    </button>
                  </form>
                </div>
              )}
            </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList
