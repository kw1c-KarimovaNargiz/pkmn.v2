import React, { useEffect, useState } from 'react';
import { useUser } from '../pages/UserContext';
import { fetchUserCollection } from '../services/api'; 
import CardList from '../components/CardList'; 
import '../styling/Index.css'; 

const CollectionPage = () => {
    const { user, loading: userLoading } = useUser();

    const [userCollection, setUserCollection] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchCollection = async () => {
            if (user) {
                try {
                    const response = await fetchUserCollection(user.email);
                    console.log('User collection response:', response);

                    if (Array.isArray(response)) {
                        setUserCollection(response); 
                    } else {
                        console.error('Unexpected response structure:', response);
                        setError('Unexpected response structure');
                    }
                } catch (error) {
                    console.error('Error fetching user collection:', error);
                    setError('Failed to fetch user collection'); 
                } finally {
                    setLoading(false);
                }
            } else if (!userLoading) {
                console.log('User information is undefined.');
                setLoading(false); 
            }
        };

        if (!userLoading) {
            fetchCollection();
        }
    }, [user, userLoading]);

    if (userLoading || loading) {
        return <div>Loading...</div>; 
    }

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <div className="cards-display-area">
            {userCollection.length > 0 ? (
                <CardList cards={userCollection.map(item => item.card)} /> 
            ) : (
                <p>No cards in your collection.</p>
            )}
        </div>
    );
};

export default CollectionPage;
