import axios from 'axios';

//register
export const registerUser = async (formData) => {
  const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
  return response.data;
};
//login
export const loginUser = async (formData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const fetchCardPrices = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/card-prices`);
        return response.data; 
    } catch (error) {
        console.error("Er is een fout opgetreden bij het ophalen van de kaartprijzen:", error);
        throw error;
    }
};
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

        //loading cards per page ??? nog niet in gebruik
        export const loadMoreCards = async (page) => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/cards?page=${page}`);
                return response.data;
            } catch (error) {
                console.error("Error loading more cards:", error);
                throw error;
            }
        };

        //filtering
    export const handleFilter = async (type) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/cards/filter?type=${type}`);
            return response.data;
            } catch (error) {
                console.error("Error searching card with type", error);
                throw error;
        }
    }

      //evo's per set for now
      export const fetchSortedEvolutionCards = async (setId) => {
          try {
              const response = await axios.get(`http://127.0.0.1:8000/api/cards/set/${setId}/sorted`);
              return response.data; 
          } catch (error) {
              console.error("Error fetching sorted evolution cards:", error);
              throw error; 
          }
      };

      export const fetchSubTypes = async (setId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/subtypes/${setId}`);
            return response.data; 
        } catch (error) {
            console.error("Error fetching sorted evolution cards:", error);
            throw error; 
        }
    };


    //add card
    export const addCardToCollection = async (payload) => {
      try {
          const response = await axios.post('http://127.0.0.1:8000/api/collections/add', {
              email: payload.email,
              card_id: payload.card_id.toString(),
              count: parseInt(payload.count), 
          }, {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              }
          });
          return response;
      } catch (error) {
          throw error;
      }
  };
  

//user's collection of cards
export const fetchUserCollection = async (email) => {
  try {
      const response = await axios.get(`http://127.0.0.1:8000/api/collections`, {
          params: { email: email }
      });
      return response.data;
  } catch (error) {
      console.error('Error fetching user collection:', error);
      throw error; 
  }
};

export const removeCardFromCollection = async (email, cardId, count) => {
    try {
        const response = await axios.delete('http://127.0.0.1:8000/api/collections/remove', {
            data: {
                email,
                card_id: cardId,
                count
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// export const removeCardFromCollection = async (email, cardId) => {
//   try {
//       const response = await fetch('http://127.0.0.1:8000/api/collections/remove', {
//           method: 'DELETE',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//               email: email,
//               card_id: cardId,
//               count: count,
//           }),
//       });

//       if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//       }

//       const data = await response.json(); 
//       console.log('Card removed successfully:', data);
//       return data; 
//   } catch (error) {
//       console.error('Error removing card from collection:', error);
//       throw error; 
//   }
// };

// export const removeCardFromCollection = async ( cardId) => {
//   try {
//     const response = await axios.delete(`http://127.0.0.1:8000/api/collections/delete`);
//     return response.data;
//   } catch (error) {
//     console.error("Error removing card from collection:", error);
//     throw error;
//   }
