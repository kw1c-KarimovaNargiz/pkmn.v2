// App.js
import React, {useState, useEffect} from 'react';

import { UserProvider } from './pages/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import {fetchSeries} from './services/api'
// import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
// import Account from './pages/Account';
import setBodyColor from './setBodyColor';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import PersistentFilterDrawer from './components/PersistentFilterDrawer';
function App() {

  setBodyColor({ color: "#1f1f1f" });
  const [series, setSeries] = useState([]);

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



  return (
    <UserProvider>
    <Router>
      <div className="App flex">
       

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen text-gray-100">
        <div className="sidebar">
                <Sidebar
                    series={series} 
                     onSeriesSelect={handleSeriesSelect}
                />
            </div>
            <PersistentFilterDrawer />
          <Routes>
            <Route path="/"  />
            <Route path="/pokedex/:setId" element={<Pokedex />} />

            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </Router>
    
    </UserProvider>
  );
}

// Apply dark theme color
setBodyColor({ color: "#1f1f1f" });

export default App;