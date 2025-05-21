import React, { useState } from 'react';

interface Trade {
    id: string;
    type: 'buy' | 'sell';
    cryptocurrency: string;
    amount: number;
    price: number;
    paymentMethod: string;
    user: string;
    status: 'active' | 'completed' | 'cancelled';
}

const P2PTrades: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');

    // Mock data - в реальном приложении будет загружаться с API
    const trades: Trade[] = [
        {
            id: '1',
            type: 'buy',
            cryptocurrency: 'BTC',
            amount: 0.5,
            price: 45000,
            paymentMethod: 'Tinkoff',
            user: 'Trader1',
            status: 'active'
        },
        {
            id: '2',
            type: 'sell',
            cryptocurrency: 'ETH',
            amount: 2.5,
            price: 2800,
            paymentMethod: 'Sber',
            user: 'Trader2',
            status: 'active'
        },
        // Добавьте больше тестовых данных по необходимости
    ];

    const cryptocurrencies = ['BTC', 'ETH', 'USDT', 'BNB'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            P2P Сделки
                        </h1>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                            Создать сделку
                        </button>
                    </div>

                    {/* Фильтры */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('buy')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                        activeTab === 'buy'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    }`}
                                >
                                    Купить
                                </button>
                                <button
                                    onClick={() => setActiveTab('sell')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                        activeTab === 'sell'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                    }`}
                                >
                                    Продать
                                </button>
                            </div>

                            <select
                                value={selectedCrypto}
                                onChange={(e) => setSelectedCrypto(e.target.value)}
                                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {cryptocurrencies.map((crypto) => (
                                    <option key={crypto} value={crypto}>
                                        {crypto}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Поиск по пользователю..."
                                className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Таблица сделок */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-700/50">
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Тип</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Криптовалюта</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Сумма</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Цена</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Способ оплаты</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Пользователь</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статус</th>
                                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {trades.map((trade) => (
                                        <tr key={trade.id} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {trade.type === 'buy' ? 'Покупка' : 'Продажа'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{trade.cryptocurrency}</td>
                                            <td className="px-6 py-4 text-gray-300">{trade.amount}</td>
                                            <td className="px-6 py-4 text-gray-300">${trade.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-gray-300">{trade.paymentMethod}</td>
                                            <td className="px-6 py-4 text-gray-300">{trade.user}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    trade.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                                                    trade.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {trade.status === 'active' ? 'Активна' :
                                                     trade.status === 'completed' ? 'Завершена' : 'Отменена'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                                    Подробнее
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default P2PTrades; 