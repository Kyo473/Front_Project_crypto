import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCryptoData } from '../../services/cryptoService';
import type { CryptoCurrency } from '../../types';

const CryptoTable: React.FC = () => {
    const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const loadCryptoData = useCallback(async () => {
        try {
            const data = await fetchCryptoData();
            setCryptocurrencies(data);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
            console.error('Error loading crypto data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCryptoData();
        // Обновляем данные каждые 5 минут
        const interval = setInterval(loadCryptoData, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [loadCryptoData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={loadCryptoData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Попробовать снова
                </button>
            </div>
        );
    }

    return (
        <section className="py-16 bg-slate-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Популярные криптовалюты</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-slate-700">
                                <th className="pb-4">Валюта</th>
                                <th className="pb-4">Цена</th>
                                <th className="pb-4">24ч</th>
                                <th className="pb-4">Объем 24ч</th>
                                <th className="pb-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptocurrencies.map((crypto) => (
                                <tr key={crypto.id} className="border-b border-slate-700">
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
            </div>
        </section>
    );
};

export default CryptoTable; 