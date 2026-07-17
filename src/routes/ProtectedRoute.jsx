import { Navigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import AppLoader from "../loaders/AppLoader";


function ProtectedRoute({children}){
    const {user, uLoading} = useAuthContext();


    if(uLoading){
        return <AppLoader />
    }


    if(!user){
        console.log(user);
        return <Navigate to="/auth" replace />;
    }


    return children;
}


export default ProtectedRoute;