import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/user/Register';
import Login from './components/user/Login';
import Home from './components/Home';
import User from './components/user/UserProfile';
import Dealpage from './components/trade/Dealpage';
import MainPage from './components/MainPage';
import CreateDeal from './components/trade/CreateDeal';
import DealDetailsPage from './components/trade/DealDetailsPage';
import TradeMapPage from './components/trade/TradeMapPage';
import ChatPage from './components/chat/ChatPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/deal" element={< Dealpage />} />
        <Route path="/create-deal" element={< CreateDeal />} />
        <Route path="/deal/:dealId" element={<DealDetailsPage />} />
        <Route path="/trade-map" element={<TradeMapPage />} />
        <Route path="/deal/:dealId/chat-page" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
