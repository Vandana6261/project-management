import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import "../styles/Layout.css"

function Layout() {
  return (
    <div className='layout'>
        <Navbar />
        Layout
        <Outlet />
    </div>
  )
}

export default Layout