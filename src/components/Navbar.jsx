import React from 'react'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate();
  return (
    <nav className='text-[#49bcb2] text-2xl font-bold'>
        <ul className='flex justify-around items-center'>
            <li onClick={() => navigate("/")} className='cursor-pointer'>Home</li>
            <li onClick={() => navigate("/auth")} className='cursor-pointer'>login</li>
        </ul>
    </nav>
  )
}

export default Navbar