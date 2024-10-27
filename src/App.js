import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { UserProvider } from './pages/UserContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { Box, Container } from '@mui/material';
import setBodyColor from './setBodyColor';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Decks from './pages/Decks';
import Index from './pages/Index';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import CollectionPage from './pages/CollectionPage';

function App() {
    return (
        <UserProvider>
            <Router>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <Navbar />
                    <Box sx={{ flexGrow: 1 }}>
                        <Container>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/Decks" element={<Decks />} />
                                <Route path="/Index" element={<Index />} />
                                <Route path="/collection" element={<CollectionPage />} />
                                <Route path="/login" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                        </Container>
                    </Box>
                </Box>
                <ToastContainer
                    position="bottom-right"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    closeButton={false}
                />
            </Router>
        </UserProvider>
    );
}

setBodyColor({ color: "#1f1f1f" });
export default App;
