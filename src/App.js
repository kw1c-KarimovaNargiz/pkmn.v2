import React, {useState, useEffect} from 'react';
import { UserProvider } from './pages/UserContext';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/SideBar';
import {fetchSeries, searchCard} from './services/api';
import Pokedex from './pages/Pokedex';
import setBodyColor from './setBodyColor';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SearchBar from './components/SearchBar';
import FilterDrawer from './components/FilterDrawer';

function AppContent() {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSeries = async () => {
        try {
            const data = await fetchSeries();
            setSeries(data);
        } catch (error) {
            console.error("Error loading series:", error);
        }
    };
    loadSeries();
  }, []);

  const handleSeriesSelect = (series) => {
    console.log('Selected series:', series);
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchCard(searchTerm);
      setSearchResults(results);
      // Navigate to pokedex with search results
      navigate('/pokedex/search', { state: { searchResults: results } });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App flex">
     

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen text-gray-100" style={{ marginTop: '60px' }}> {/* Add margin-top to account for fixed header */}
      <div className="sidebar" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '18%',
    height: '100vh',
    zIndex: 1200,
    backgroundColor: '#1f1f1f',
    overflowY: 'auto'
}}>
    <Sidebar
        series={series} 
        onSeriesSelect={handleSeriesSelect}
    />
</div>
        <FilterDrawer />
        <div style={{
        position: 'fixed',
        right: '20px',
        top: '20px',
        width: '300px',
        zIndex: 1300, // Higher than header's 1200
        backgroundColor: '#1f1f1f', // Match background color
        padding: '10px',
        borderRadius: '8px'
      }}> 
        <SearchBar onSearch={handleSearch} />
      </div>
        <Routes>
          <Route path="/" />
          <Route 
            path="/pokedex/:setId" 
            element={
              <Pokedex 
                searchResults={searchResults} 
                setSearchResults={setSearchResults}
              />
            } 
          />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  setBodyColor({ color: "#1f1f1f" });

  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

setBodyColor({ color: "#1f1f1f" });

export default App;