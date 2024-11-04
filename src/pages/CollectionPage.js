import React, { useEffect, useState } from 'react';
import { useUser } from '../pages/UserContext';
import CardList from '../components/CardList';
import '../styling/Index.css';
import useApi from '../hooks/useApi';

const CollectionPage = () => {
    const { user, authToken, userLoading } = useUser();
    const [userCollection, setUserCollection] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { data: collectionData, error: collectionError, isLoading: collectionLoading, triggerFetch: refetchCollection } = useApi('collections', {}, false, 'GET');

    useEffect(() => {
        if (authToken && !userLoading) {
            refetchCollection();
        }
    }, [authToken, userLoading]);

    useEffect(() => {
        if (collectionData) {
            setUserCollection(collectionData);
            setLoading(false);
        }
        if (collectionError) {
            setError('Failed to fetch user collection');
            setLoading(false);
        }
    }, [collectionData, collectionError, collectionLoading]);

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