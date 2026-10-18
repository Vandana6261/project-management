import { Navigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import AppLoader from "../loaders/AppLoader";

function PublicRoute({ children }) {
  const { user, uLoading } = useAuthContext();

  if (uLoading) {
    return <AppLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
