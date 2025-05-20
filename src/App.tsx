import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/layout/Navigation';
import Home from './pages/Home';
import GuestLanding from './pages/GuestLanding';
import Market from './pages/Market';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import CryptoDetails from './pages/CryptoDetails';
import { useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route path="/" element={isAuthenticated ? <Home /> : <GuestLanding />} />
            <Route path="/market" element={<Market />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/crypto/:id" element={<CryptoDetails />} />
        </Routes>
    );
};

const AppContent = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Navigation />
            <main className="container mx-auto px-4 py-8">
                <AppRoutes />
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
