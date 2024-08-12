import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { Spin } from "antd";
export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    React.useEffect(() => {
        const unsubcibed = auth.onAuthStateChanged((user) => {
            // console.log(user)
            if (user) {
                const { displayName, email, photoURL, uid } = user
                setUser({ displayName, email, photoURL, uid })
                setIsLoading(false)
                navigate("/");
                return
            }
            setIsLoading(false)
            navigate("/login");
        })
        return () => {
            unsubcibed();
        }
    }, [navigate])

    return (
        <AuthContext.Provider value={user}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    )
}