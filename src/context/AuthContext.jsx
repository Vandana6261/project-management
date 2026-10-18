import { createContext, useState, useContext, useEffect } from "react"
import { me } from "../utils/user";
import { logoutUser } from "../services/Auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [uLoading, setULoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function firstCall() {
      setULoading(true)
      try {
        const isUser = await me();
        if (isUser && isUser.success && isUser.username) {
          setUser(isUser.username);
          setUserEmail(isUser.email || null);
          setError(null);
        } else {
          setUser(null);
          setUserEmail(null);
          setError(isUser?.message || null);
        }
      } catch (error) {
        console.log(error);
        setUser(null);
        setUserEmail(null);
      }
      finally {
        setULoading(false)
      }
    }
    firstCall()
  }, [])

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setUserEmail(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, userEmail, setUserEmail, uLoading, error, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    return new Error('AuthContext must be used inside authProvider')
  }

  return context;
}