import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoData } from '../services/cryptoService';
import type { CryptoCurrency } from '../types';

const Market: React.FC = () => {
    const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadCryptoData = async () => {
            try {
                const data = await fetchCryptoData(100);
                setCryptocurrencies(data);
                setError(null);
            } catch (err) {
                setError('Ошибка загрузки данных');
                console.error('Error loading crypto data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCryptoData();
        const interval = setInterval(loadCryptoData, 30000);

        return () => clearInterval(interval);
    }, []);

    const filteredCryptocurrencies = cryptocurrencies.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">

                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">

                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Рынок криптовалют</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск по названию или символу..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <svg
                            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-700">
                                <th className="pb-4">#</th>
                                <th className="pb-4">Валюта</th>
                                <th className="pb-4">Цена</th>
                                <th className="pb-4">24ч</th>
                                <th className="pb-4">Объем 24ч</th>
                                <th className="pb-4">Капитализация</th>
                                <th className="pb-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCryptocurrencies.map((crypto, index) => (
                                <tr key={crypto.id} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                                    <td className="py-4 text-gray-400">{index + 1}</td>
                                    <td className="py-4">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={crypto.image}
                                                alt={crypto.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <div className="font-medium">{crypto.name}</div>
                                                <div className="text-sm text-gray-400">{crypto.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">${crypto.price.toLocaleString()}</td>
                                    <td className={`py-4 ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                                    </td>
                                    <td className="py-4">${crypto.volume24h}</td>
                                    <td className="py-4">${crypto.marketCap}</td>
                                    <td className="py-4">
                                        <button
                                            onClick={() => navigate(`/crypto/${crypto.id}`)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Подробнее
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Market; 