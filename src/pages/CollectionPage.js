import React, { useEffect } from 'react';
import { useUser } from '../pages/UserContext';
import { fetchUserCollection } from '../services/api'; 

const CollectionPage = () => {
    const { user } = useUser();

    useEffect(() => {
        const fetchCollection = async () => {
            if (user) { 
                try {
                    const response = await fetchUserCollection(user.email);
                    console.log('User collection:', response);
                } catch (error) {
                    console.error('Error fetching user collection:', error);
                }
            } else {
                console.log('User information is undefined.');
            }
        };

        fetchCollection();
    }, [user]);

    return (
        <div>
          
        </div>
    );
};

export default CollectionPage;
