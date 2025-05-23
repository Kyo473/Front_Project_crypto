import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-blue-500">404</h1>
                <h2 className="text-3xl font-semibold text-white mt-4">Страница не найдена</h2>
                <p className="text-gray-400 mt-2 mb-8">
                    Извините, запрашиваемая страница не существует
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
};

export default NotFound; 