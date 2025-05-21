import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';
import { observer } from 'mobx-react-lite';
import { tradeStore } from '../stores/TradeStore';

const P2PTrades: React.FC = observer(() => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
    const [selectedCrypto, setSelectedCrypto] = useState<string>('BTC');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [mapRef, setMapRef] = useState<any>(null);

    useEffect(() => {
        tradeStore.fetchTrades();
    }, []);

    const cryptocurrencies = ['BTC', 'ETH', 'USDT', 'BNB'];

    // Функция для геокодирования адреса
    const geocodeAddress = async (address: string) => {
        try {
            const response = await fetch(
                `https://geocode-maps.yandex.ru/1.x/?apikey=${import.meta.env.VITE_YANDEX_MAP}&format=json&geocode=${encodeURIComponent(address)}`
            );
            const data = await response.json();
            const coordinates = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(Number).reverse();
            return coordinates;
        } catch (error) {
            console.error('Ошибка геокодирования:', error);
            return null;
        }
    };

    // Обработчик поиска
    const handleSearch = async () => {
        if (!searchQuery || !mapRef) return;

        const coordinates = await geocodeAddress(searchQuery);
        if (coordinates) {
            mapRef.setCenter(coordinates, 12);
        }
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
                                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                                    Создать сделку
                                </button>
                            </div>

                            {/* Яндекс Карта */}
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50 overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Активные сделки на карте</h2>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Поиск по адресу..."
                                            className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleSearch}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Найти
                                        </button>
                                    </div>
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
                                                trade.location && (
                                                    <Placemark
                                                        key={trade.id}
                                                        geometry={trade.location.coordinates}
                                                        properties={{
                                                            balloonContent: `
                                                                <div style="padding: 10px;">
                                                                    <h3 style="margin: 0 0 10px 0;">${trade.type === 'buy' ? 'Покупка' : 'Продажа'} ${trade.cryptocurrency}</h3>
                                                                    <p style="margin: 0 0 5px 0;">Сумма: ${trade.amount} ${trade.cryptocurrency}</p>
                                                                    <p style="margin: 0 0 5px 0;">Цена: $${trade.price.toLocaleString()}</p>
                                                                    <p style="margin: 0 0 5px 0;">Способ оплаты: ${trade.paymentMethod}</p>
                                                                    <p style="margin: 0 0 5px 0;">Пользователь: ${trade.user}</p>
                                                                    <p style="margin: 0;">Адрес: ${trade.location.address}</p>
                                                                </div>
                                                            `
                                                        }}
                                                        options={{
                                                            preset: trade.type === 'buy' ? 'islands#greenStretchyIcon' : 'islands#redStretchyIcon',
                                                            iconColor: trade.type === 'buy' ? '#22C55E' : '#EF4444'
                                                        }}
                                                    />
                                                )
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
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Сумма</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Цена</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Способ оплаты</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Пользователь</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статус</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {tradeStore.getTrades().map((trade) => (
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
});

export default P2PTrades; 