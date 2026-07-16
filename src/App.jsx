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


function App() {

  const { setUser } = useAuthContext()
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  useEffect( ()=>{
    async function firstCall() {
      setIsLoading(true)
      try {
        const isUser = await me();
        if(!isUser.success) {
          setError(isUser.message);
        }
        console.log(isUser)
        setUser(isUser.username);
      } catch (error) {
        console.log(error)
      }
      finally
      {
        setIsLoading(false)
      }
    }
    firstCall()
  },[])

  return <RouterProvider router={router} />
}

export default App
