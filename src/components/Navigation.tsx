import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';

const Navigation: React.FC = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout } = authStore;

    useEffect(() => {
        // Handle redirects based on authentication status
        if (isAuthenticated) {
            // If user is authenticated and tries to access auth pages, redirect to profile
            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
                navigate('/profile');
            }
        } else {
            // If user is not authenticated and tries to access protected pages, redirect to home
            if (location.pathname === '/profile') {
                navigate('/');
            }
        }
    }, [isAuthenticated, location.pathname, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-slate-800 border-b border-slate-700">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-white font-bold text-xl">
                        CryptoApp
                    </Link>
                    
                    {!isAuthenticated && (
                        <div className="flex items-center space-x-8">
                            <Link
                                to="/market"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Маркет
                            </Link>
                            <Link
                                to="/about"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                О нас
                            </Link>
                        </div>
                    )}
                    
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Профиль
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
});

export default Navigation; 