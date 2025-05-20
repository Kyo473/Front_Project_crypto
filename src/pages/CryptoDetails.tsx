import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCryptoDetails, fetchCryptoHistory } from '../services/cryptoService';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    ChartData,
    ChartOptions,
} from 'chart.js';
import 'chart.js/auto';
import type { CryptoDetails } from '../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
);

const CryptoDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cryptoData, setCryptoData] = useState<CryptoDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setError('ID криптовалюты не указан');
                setLoading(false);
                return;
            }

            try {
                console.log('Loading data for:', id);
                const details = await fetchCryptoDetails(id);
                console.log('Loaded data:', details);
                setCryptoData(details);
                setError(null);
            } catch (err) {
                console.error('Error loading crypto details:', err);
                setError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">

                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error || !cryptoData) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">

                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/market')}
                        className="mb-8 flex items-center text-sky-500 hover:text-sky-400"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Назад к списку
                    </button>
                    <div className="text-center text-red-500">{error || 'Криптовалюта не найдена'}</div>
                </div>
            </div>
        );
    }

    console.log('Rendering with data:', cryptoData);
    console.log('Price history:', cryptoData.priceHistory[timeRange]);

    const priceHistory = cryptoData.priceHistory[timeRange] || [];
    const priceChartData: ChartData<'line'> = {
        labels: priceHistory.map(([timestamp]) => new Date(timestamp).toLocaleDateString()),
        datasets: [
            {
                label: 'Цена (USD)',
                data: priceHistory.map(([, price]) => price),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4
            }
        ]
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: 'white',
                },
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: function(context: any) {
                        return `$${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'white',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'white',
                    callback: function(value: any) {
                        return '$' + value.toLocaleString();
                    }
                },
            },
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false,
        },
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">

            <main className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/market')}
                    className="mb-8 flex items-center text-sky-500 hover:text-sky-400"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад к списку
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800 rounded-xl p-6">
                            <div className="flex items-center mb-6">
                                <img src={cryptoData.image} alt={cryptoData.name} className="w-16 h-16 mr-4" />
                                <div>
                                    <h1 className="text-2xl font-bold">{cryptoData.name}</h1>
                                    <p className="text-gray-400">{cryptoData.symbol}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Текущая цена</h2>
                                    <p className="text-3xl font-bold">${cryptoData.currentPrice.toLocaleString()}</p>
                                    <p className={`text-lg ${cryptoData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {cryptoData.priceChange24h >= 0 ? '+' : ''}{cryptoData.priceChange24h.toFixed(2)}%
                                    </p>
                                </div>
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Объем торгов за 24ч</h2>
                                    <p className="text-3xl font-bold">${cryptoData.totalVolume.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Максимум за 24ч</h2>
                                    <p className="text-2xl font-bold">${cryptoData.high24h.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-800 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-4">Минимум за 24ч</h2>
                                    <p className="text-2xl font-bold">${cryptoData.low24h.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-6 mb-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">График цены</h2>
                                    <div className="flex space-x-2">
                                        {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                                            <button
                                                key={range}
                                                onClick={() => setTimeRange(range)}
                                                className={`px-3 py-1 rounded ${
                                                    timeRange === range
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                }`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-96">
                                    {priceHistory.length > 0 ? (
                                        <Line data={priceChartData} options={chartOptions} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            Нет данных для отображения
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-800 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">Статистика</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-gray-400">Рыночная капитализация</div>
                                    <div className="text-lg">${(cryptoData.marketCap / 1000000000).toFixed(2)}B</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Максимум (24ч)</div>
                                    <div className="text-lg">${cryptoData.high24h.toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Минимум (24ч)</div>
                                    <div className="text-lg">${cryptoData.low24h.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-4">Исторические данные</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-gray-400">Максимум за все время</div>
                                    <div className="text-lg">${cryptoData.ath.toLocaleString()}</div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(cryptoData.athDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-400">Минимум за все время</div>
                                    <div className="text-lg">${cryptoData.atl.toLocaleString()}</div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(cryptoData.atlDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-slate-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">О {cryptoData.name}</h2>
                    <p className="text-gray-300 mb-6">{cryptoData.description}</p>
                    {cryptoData.website && (
                        <a
                            href={cryptoData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                        >
                            Официальный сайт
                        </a>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CryptoDetails; 