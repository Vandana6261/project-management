import Auth from './pages/Auth'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Layout from './pages/layout/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import useAuthContext from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import AppLoader from './loaders/AppLoader'
import AppLayout from './pages/layout/AppLayout'
import { ProjectProvider } from './context/ProjectContext'
import WorkspaceLayout from './pages/layout/WorkspaceLayout'
import ProjectOverview, { getProjectDataLoader } from './components/ProjectOverview'
import ProjectTasksPage from './pages/ProjectTasksPage'
import TaskDetailPage from './pages/TaskDetailPage'

const ProjectChatbot = () => <div className="text-title font-bold text-xl">Project AI Assistant</div>;

function App() {
  const { uLoading } = useAuthContext();

  const router = createBrowserRouter([
    // Public Landing & Auth Routes (Redirects directly to /dashboard if user is logged in)
    {
      path: "/",
      element: (
        <PublicRoute>
          <Layout />
        </PublicRoute>
      ),
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
          <ProjectProvider>
          <AppLayout />
          </ProjectProvider>
        </ProtectedRoute>
      ),
      children: [
        { 
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "workspace/:projectId",
          element: <WorkspaceLayout />,
          loader: getProjectDataLoader,
          children: [
            { index: true, element: <ProjectOverview /> },
            { path: "tasks", element: <ProjectTasksPage /> },
            { path: "tasks/:taskId", element: <TaskDetailPage /> },
            { path: "my-tasks", element: <ProjectTasksPage filterAssignedOnly={true} /> },
            { path: "chatbot", element: <ProjectChatbot /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  if (uLoading) return <AppLoader />;
  return <RouterProvider router={router} />;
}

export default App;