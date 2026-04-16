import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true; // ✅ important

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthStatus = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/auth/is-auth', {withCredentials:true});

            if (res.data.success) {
                setIsLoggedIn(true);
                await getUserData(); // wait for user data
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        getAuthStatus();
    }, []);

    const getUserData = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/user/data`);

            if (res.data.success) {
                setUserData(res.data.userdata);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};