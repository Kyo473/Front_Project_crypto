import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import GuestLanding from './pages/GuestLanding';
import Market from './pages/Market';
import About from './pages/About';
import CryptoDetails from './pages/CryptoDetails';

const App: React.FC = observer(() => {
    return (
        <BrowserRouter>
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
                </Routes>
            </div>
        </BrowserRouter>
    );
});

export default App;
