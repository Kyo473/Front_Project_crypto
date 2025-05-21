import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import GuestLanding from './pages/GuestLanding';
import Market from './pages/Market';
import About from './pages/About';
import CryptoDetails from './pages/CryptoDetails';
import P2PTrades from './pages/P2PTrades';
import TradeDetails from './pages/TradeDetails';
import ApiDocs from './pages/ApiDocs';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = observer(() => {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-slate-900">
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<GuestLanding />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/market" element={<Market />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/crypto/:id" element={<CryptoDetails />} />
                        <Route path="/p2p" element={<P2PTrades />} />
                        <Route path="/p2p-trades" element={<P2PTrades />} />
                        <Route path="/p2p-trades/:id" element={<TradeDetails />} />
                        <Route path="/api-docs" element={<ApiDocs />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
});

export default App;
