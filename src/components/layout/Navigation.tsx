import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-slate-800 border-b border-slate-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            CryptoApp
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                isActive('/') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            Главная
                        </Link>
                        <Link
                            to="/market"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                isActive('/market') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            Рынок
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/wallet"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    isActive('/wallet') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                            >
                                Кошелек
                            </Link>
                        )}
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/profile"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/profile') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    Профиль
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                                >
                                    Выйти
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/login') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                                >
                                    Войти
                                </Link>
                                <Link
                                    to="/register"
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isActive('/register') ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
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
};

export default Navigation; 