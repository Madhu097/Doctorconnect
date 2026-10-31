import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  const linkStyle = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl border-l-[3px] px-3 py-3 transition-all duration-200 sm:px-4 ${
      isActive
        ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-700 shadow-sm'
        : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
    }`

  return (
    <aside className="min-h-screen w-[68px] shrink-0 border-r border-slate-200 bg-white transition-all duration-300 sm:w-[76px] md:w-[220px] lg:w-[260px]">
      {aToken && (
        <nav className="sticky top-0 px-2 py-5 sm:px-3 md:px-4">
          {/* Navigation */}
          <ul className="space-y-2">

            {/* Dashboard */}
            <li>
              <NavLink
                to="/admin-dashboard"
                className={linkStyle}
                title="Dashboard"
              >
                <img
                  src={assets.home_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Dashboard
                </span>
              </NavLink>
            </li>

            {/* Appointments */}
            <li>
              <NavLink
                to="/all-appointments"
                className={linkStyle}
                title="Appointments"
              >
                <img
                  src={assets.appointment_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Appointments
                </span>
              </NavLink>
            </li>

            {/* Add Doctor */}
            <li>
              <NavLink
                to="/add-doctor"
                className={linkStyle}
                title="Add Doctor"
              >
                <img
                  src={assets.add_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Add Doctor
                </span>
              </NavLink>
            </li>

            {/* Doctors List */}
            <li>
              <NavLink
                to="/doctor-list"
                className={linkStyle}
                title="Doctors List"
              >
                <img
                  src={assets.people_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Doctors List
                </span>
              </NavLink>
            </li>

          </ul>
        </nav>
      )}


     {dToken && (
        <nav className="sticky top-0 px-2 py-5 sm:px-3 md:px-4">
          {/* Navigation */}
          <ul className="space-y-2">

            {/* Dashboard */}
            <li>
              <NavLink
                to="/doctor-dashboard"
                className={linkStyle}
                title="Dashboard"
              >
                <img
                  src={assets.home_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Dashboard
                </span>
              </NavLink>
            </li>

            {/* Appointments */}
            <li>
              <NavLink
                to="/doctor-appointments"
                className={linkStyle}
                title="Appointments"
              >
                <img
                  src={assets.appointment_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Appointments
                </span>
              </NavLink>
            </li>

           
            {/* Doctors List */}
            <li>
              <NavLink
                to="/doctor-profile"
                className={linkStyle}
                title="Doctors List"
              >
                <img
                  src={assets.people_icon}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain transition-transform duration-200 group-hover:scale-110"
                />
                <span className="hidden whitespace-nowrap text-sm md:inline">
                  Profile
                </span>
              </NavLink>
            </li>

          </ul>
        </nav>
      )}


    </aside>
  )
}

export default Sidebar;
