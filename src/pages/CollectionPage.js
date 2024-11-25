import { useUser } from '../pages/UserContext';
import CardList from '../components/CardList';
import '../styling/Index.css';

const CollectionPage = () => {
    const { userLoading } = useUser();

    if (userLoading) return <div>Loading...</div>;
    return (
        <CardList
            type="collection"
            isCollectionView={true}
        />
    );
};

export default CollectionPage;