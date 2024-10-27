import React, { createContext, useContext, useState, useEffect } from 'react';

// todo this is not a page, move to hooks or a seperate providers/context folder

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setUserLoading(true);

            //todo fetch user from server
            try {
                const authToken = localStorage.getItem('authToken');
                console.log('stored authToken:', authToken);
                if (authToken !== null && authToken !== 'undefined') {
                    // console.log('setting authToken:', authToken);
                    setAuthToken(authToken);
                    const savedUser = JSON.parse(localStorage.getItem('user'));
                    if (savedUser) {
                        console.log('setting user', savedUser)
                        setUser(savedUser);
                    }
                } else {
                    console.log('No authToken found');
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
        <UserContext.Provider value={{ user, setUser, userLoading, logout, authToken }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
