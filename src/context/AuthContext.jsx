import { createContext, useState, useContext } from "react"

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider value={{user, setUser}}>
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