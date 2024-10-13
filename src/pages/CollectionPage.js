import React, { useEffect, useState } from 'react';
import { useUser } from '../pages/UserContext';
import { fetchUserCollection } from '../services/api'; 
import CardList from '../components/CardList'; 
import '../styling/Index.css'; 

const CollectionPage = () => {
    const { user } = useUser();
    const [userCollection, setUserCollection] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchCollection = async () => {
            if (!user) { 
                console.log('User is not logged in, cannot fetch their collection');
                setError('You need to log in to view your collection.');
                setLoading(false);
                return;
            }

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
        };

        fetchCollection();
    }, [user]);

    if (loading) {
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
