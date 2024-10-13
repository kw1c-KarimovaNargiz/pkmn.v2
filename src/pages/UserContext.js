import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setUserLoading(true);
            try {
                const authToken = localStorage.getItem('authToken');
                if (authToken) {
                    const savedUser = JSON.parse(localStorage.getItem('user'));
                    if (savedUser) {
                        setUser(savedUser);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setUserLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, userLoading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
