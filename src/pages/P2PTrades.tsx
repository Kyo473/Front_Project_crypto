import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { tradeStore } from '../stores/TradeStore';
import { authStore } from '../stores/AuthStore';

const P2PTrades: React.FC = observer(() => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
    const [mapRef, setMapRef] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTrade, setNewTrade] = useState({
        price: 0,
        amount: 0,
        currency: 'BTC',
        description: '',
        lat: 0,
        lon: 0
    });
    const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        tradeStore.fetchTrades();
    }, []);

    const cryptocurrencies = ['BTC', 'MATIC', 'USDT'];
    const paymentMethods = [
        'Сбербанк',
        'Тинькофф',
        'Альфа-Банк',
        'ВТБ',
        'Райффайзен'
    ];

    const handleCreateTrade = async () => {
        try {
            if (!authStore.user) {
                tradeStore.error = 'Требуется авторизация';
                return;
            }

            const tradeData = {
                seller_id: authStore.user.id,
                seller_address: authStore.user.address,
                price: newTrade.price,
                amount: newTrade.amount,
                currency: newTrade.currency,
                description: newTrade.description,
                lat: selectedLocation ? selectedLocation[0] : 0,
                lon: selectedLocation ? selectedLocation[1] : 0,
                hide: 'Create'
            };

            await tradeStore.createTrade(tradeData);
            setIsModalOpen(false);
            setNewTrade({
                price: 0,
                amount: 0,
                currency: 'BTC',
                description: '',
                lat: 0,
                lon: 0
            });
            setSelectedLocation(null);
        } catch (error) {
            console.error('Error creating trade:', error);
        }
    };

    const handleMapClick = (e: any) => {
        const coords = e.get('coords');
        setSelectedLocation(coords);
        setNewTrade(prev => ({
            ...prev,
            lat: coords[0],
            lon: coords[1]
        }));
    };

    const handleTradeClick = (tradeId: string) => {
        navigate(`/p2p-trades/${tradeId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {tradeStore.getError() && (
                        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                            {tradeStore.getError()}
                        </div>
                    )}
                    
                    {tradeStore.isLoading() ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                    P2P Сделки
                                </h1>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                >
                                    Создать сделку
                                </button>
                            </div>

                            {/* Модальное окно создания сделки */}
                            {isModalOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl">
                                        <h2 className="text-2xl font-bold mb-6">Создание новой сделки</h2>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Криптовалюта</label>
                                                <select
                                                    value={newTrade.currency}
                                                    onChange={(e) => setNewTrade(prev => ({ ...prev, currency: e.target.value }))}
                                                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    {cryptocurrencies.map((crypto) => (
                                                        <option key={crypto} value={crypto}>{crypto}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Сумма сделки</label>
                                                    <input
                                                        type="number"
                                                        value={newTrade.price}
                                                        onChange={(e) => setNewTrade(prev => ({ ...prev, price: Number(e.target.value) }))}
                                                        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2">Кол-во</label>
                                                    <input
                                                        type="number"
                                                        value={newTrade.amount}
                                                        onChange={(e) => setNewTrade(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                                        className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="0"
                                                        step="0.00000001"
                                                    />
                                                </div>
                                            </div>

                                            {newTrade.currency === 'USDT' && newTrade.price > 0 && newTrade.amount > 0 && (
                                                <div className="mt-2 p-3 bg-slate-700/50 rounded-lg">
                                                    <p className="text-sm text-gray-300">
                                                        1 USDT = {(newTrade.price / newTrade.amount).toFixed(2)} ₽
                                                    </p>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Способ оплаты</label>
                                                <select
                                                    value={newTrade.description}
                                                    onChange={(e) => setNewTrade(prev => ({ ...prev, description: e.target.value }))}
                                                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Выберите банк</option>
                                                    {paymentMethods.map((method) => (
                                                        <option key={method} value={method}>{method}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Выберите местоположение на карте</label>
                                                <div className="h-[200px] rounded-lg overflow-hidden">
                                                    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAP }}>
                                                        <Map
                                                            defaultState={{
                                                                center: [55.751244, 37.618423],
                                                                zoom: 4
                                                            }}
                                                            width="100%"
                                                            height="100%"
                                                            onClick={handleMapClick}
                                                        >
                                                            {selectedLocation && (
                                                                <Placemark
                                                                    geometry={selectedLocation}
                                                                    options={{
                                                                        preset: 'islands#blueStretchyIcon'
                                                                    }}
                                                                />
                                                            )}
                                                        </Map>
                                                    </YMaps>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 mt-6">
                                            <button
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                onClick={handleCreateTrade}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                disabled={!newTrade.description || !selectedLocation || !newTrade.amount || !newTrade.price}
                                            >
                                                Создать
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Яндекс Карта */}
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50 overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Активные сделки на карте</h2>
                                </div>
                                <div className="h-[400px] rounded-xl overflow-hidden">
                                    <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAP }}>
                                        <Map
                                            defaultState={{
                                                center: [55.751244, 37.618423],
                                                zoom: 4,
                                                controls: ['zoomControl', 'fullscreenControl']
                                            }}
                                            width="100%"
                                            height="100%"
                                            modules={[
                                                'control.ZoomControl',
                                                'control.FullscreenControl',
                                                'control.SearchControl',
                                                'geoObject.addon.balloon'
                                            ]}
                                            instanceRef={setMapRef}
                                        >
                                            <SearchControl options={{ float: 'right' }} />
                                            {tradeStore.getTrades().map((trade) => (
                                                <Placemark
                                                    key={trade.id}
                                                    geometry={[trade.lat, trade.lon]}
                                                    properties={{
                                                        balloonContent: `
                                                            <div style="padding: 10px;">
                                                                <h3 style="margin: 0 0 10px 0;">${trade.buyer_address ? 'Покупка' : 'Продажа'} ${trade.currency}</h3>
                                                                <p style="margin: 0 0 5px 0;">Кол-во: ${trade.amount} ${trade.currency}</p>
                                                                <p style="margin: 0 0 5px 0;">Сумма сделки: ${trade.price.toLocaleString()} ₽</p>
                                                                <p style="margin: 0 0 5px 0;">Способ оплаты: ${trade.description}</p>
                                                                <p style="margin: 0 0 5px 0;">Продавец: ${trade.seller_address}</p>
                                                            </div>
                                                        `
                                                    }}
                                                    options={{
                                                        preset: trade.buyer_address ? 'islands#greenStretchyIcon' : 'islands#redStretchyIcon',
                                                        iconColor: trade.buyer_address ? '#22C55E' : '#EF4444'
                                                    }}
                                                    onClick={() => handleTradeClick(trade.id)}
                                                />
                                            ))}
                                        </Map>
                                    </YMaps>
                                </div>
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
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Кол-во</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Сумма сделки</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Способ оплаты</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Продавец</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статус</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {tradeStore.getTrades().map((trade) => (
                                                <tr key={trade.id} className="hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            trade.buyer_address ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {trade.buyer_address ? 'Покупка' : 'Продажа'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.currency}</td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.amount}</td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.price.toLocaleString()} ₽</td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.description}</td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.seller_address}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            trade.hide === 'Create' ? 'bg-blue-500/20 text-blue-400' :
                                                            trade.hide === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            trade.hide === 'Successful' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {tradeStore.mapHideStatusToTradeStatus(trade.hide)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => handleTradeClick(trade.id)}
                                                            className="text-blue-400 hover:text-blue-300 transition-colors"
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default P2PTrades; 