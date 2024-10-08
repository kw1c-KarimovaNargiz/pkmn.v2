import axios from 'axios';


//fetch all series and their according sets
export const fetchSeries = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/series');
      return response.data;
    } catch (error) {
      console.error("Error fetching series:", error);
      throw error;
    }
  };

  //fetch all cards to their according set
  export const fetchCardsForSet = async (setId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/sets/${setId}/cards`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cards for set:", error);
      throw error;
    }
  };

  //search for a card
  export const searchCard = async (searchTerm) => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/search?query=${searchTerm}`);
            return response.data;
            } catch (error) {
                console.error("Error searching for card:", error);
                throw error;
            }  
        };

        export const loadMoreCards = async (page) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/cards?page=${page}`);
                return response.data;
            } catch (error) {
                console.error("Error loading more cards:", error);
                throw error;
            }
        };

    export const handleFilter = async (type) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/cards/filter?type=${type}`);
            return response.data;
            } catch (error) {
                console.error("Error searching card with type", error);
                throw error;
        }
    }