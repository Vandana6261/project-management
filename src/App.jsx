import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
// import './App.css'
import Auth from './pages/Auth'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './pages/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import useAuthContext from './context/AuthContext'
import { me } from './utils/user'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLoader from './loaders/AppLoader'
import AppLayout from './pages/layout/AppLayout'



const TasksPage = () => <div className="text-title font-bold text-xl">Tasks Workspace</div>;
const ChatbotPage = () => <div className="text-title font-bold text-xl">AI Assistant Engine</div>;
const NotificationsPage = () => <div className="text-title font-bold text-xl">Activity Notifications</div>;

function App() {
  const { uLoading } = useAuthContext();

  const router = createBrowserRouter([
    // Public Landing Routes
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "auth", element: <Auth /> },
      ],
    },
    // Protected Dashboard & Workspace Routes
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        { 
          path: "dashboard",
          element: <Dashboard />,
          children: [
          ]
        },
        {path: "workspace", element: <div>Workspace</div>}
      ],
    },
  ]);

  if (uLoading) return <AppLoader />;
  return <RouterProvider router={router} />;
}

export default App;