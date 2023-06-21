/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', null);

    /**
     * Login or Register process
     * Set user data and token then navigate to home
     * @param {Any} data 
     */
    const loginOrRegister = data => {
        setToken(data);
        window.location.reload()
    }

    /**
     * Logout process
     * Clear user data and token then navigate to home
     */
    const logout = () => {
        setToken(null);
        window.location.reload()
    }

    const value = useMemo(
    () => ({
        token,
        loginOrRegister,
        logout,
    }), [token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};