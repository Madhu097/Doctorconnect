import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import {useNavigate} from 'react-router-dom'
const Navbar = () => {
    const {aToken,setAToken} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)
    const navigate = useNavigate()
    const logout=()=>{
        navigate('/')
        setAToken('')
        setDToken('')
        localStorage.removeItem('aToken')
        localStorage.removeItem('dToken')
        
    }
  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <button onClick={() => navigate('/')} className='flex items-center gap-2 text-lg font-bold tracking-tight text-primary'>
          <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white'>D</span>
          <span>DoctorConnect</span>
        </button>
        <p className='border px-2 py-0.5 rounded-full border-gray-500 text-gray-600'>{
            aToken? 'Admin':'Doctor'}</p>
      </div>
      <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar
