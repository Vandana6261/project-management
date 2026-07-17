import { createContext, useState, useContext, useEffect } from "react"
import { me } from "../utils/user";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    console.log("auth provider rendering")
    const [user, setUser] = useState(null);
    const [uLoading, setULoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( ()=>{
        async function firstCall() {
          setULoading(true)
          try {
            const isUser = await me();
            // console.log(isUser);
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
            setULoading(false)
          }
        }
        firstCall()
      },[])


    return (
        <AuthContext.Provider value={{user, setUser, uLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuthContext() {
    const context = useContext(AuthContext);
    if(!context) {
        return new Error('AuthContext must be used inside authProvider')
    }

    return context;
}