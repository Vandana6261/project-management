import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/Navbar'

function Layout() {
  return (
    <div className="min-h-screen bg-page text-body transition-colors duration-300">
      <Navbar />
      {/* Spacer to push content gracefully below the fixed 16px (h-16) nav height */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout;