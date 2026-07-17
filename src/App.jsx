import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './App.css'
import Auth from './pages/Auth'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import useAuthContext from './context/AuthContext'
import { me } from './utils/user'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLoader from './loaders/AppLoader'


function App() {

  const { setUser, uLoading } = useAuthContext()
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "/auth",
          element: <Auth />
        },
        {
          path: "/dashboard",
          element: <Dashboard/>
        }
      ]
    }
  ])
 
  if(isLoading) return <AppLoader />
  return <RouterProvider router={router} />
}

export default App
