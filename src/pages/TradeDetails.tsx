import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { observer } from 'mobx-react-lite';
import { tradeStore } from '../stores/TradeStore';
import { authStore } from '../stores/AuthStore';

const TradeDetails: React.FC = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trade, setTrade] = useState(tradeStore.getTrades().find(t => t.id === id));
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        if (!trade) {
            navigate('/p2p-trades');
        }
    }, [trade, navigate]);

    if (!trade) {
        return null;
    }

    const handleAcceptTrade = async () => {
        try {
            setIsAccepting(true);
            await tradeStore.acceptTrade(trade.id);
            // Обновляем локальное состояние сделки
            setTrade(tradeStore.getTrades().find(t => t.id === trade.id));
            // Перенаправляем на страницу сделок
            navigate('/p2p-trades');
        } catch (error) {
            console.error('Error accepting trade:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => navigate('/p2p-trades')}
                            className="flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Назад к списку сделок
                        </button>
                    </div>

                    {tradeStore.getError() && (
                        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                            {tradeStore.getError()}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Информация о сделке */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">
                                        {trade.buyer_address ? 'Покупка' : 'Продажа'} {trade.currency}
                                    </h1>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        trade.hide === 'Create' ? 'bg-blue-500/20 text-blue-400' :
                                        trade.hide === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                        trade.hide === 'Successful' ? 'bg-green-500/20 text-green-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                        {tradeStore.mapHideStatusToTradeStatus(trade.hide)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Цена</label>
                                        <p className="text-2xl font-semibold">${trade.price.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Количество</label>
                                        <p className="text-2xl font-semibold">{trade.amount} {trade.currency}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Способ оплаты</label>
                                    <p className="text-lg">{trade.description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Продавец</label>
                                    <p className="text-lg">{trade.seller_address}</p>
                                </div>

                                {trade.hide === 'Create' && (
                                    <button
                                        onClick={handleAcceptTrade}
                                        disabled={isAccepting || !authStore.isAuthenticated}
                                        className={`w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium transition-all duration-300 ${
                                            isAccepting || !authStore.isAuthenticated
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:from-blue-600 hover:to-purple-600'
                                        }`}
                                    >
                                        {isAccepting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                                Обработка...
                                            </div>
                                        ) : (
                                            trade.buyer_address ? 'Купить' : 'Продать'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Карта */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                            <h2 className="text-xl font-semibold mb-4">Местоположение</h2>
                            <div className="h-[400px] rounded-lg overflow-hidden">
                                <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAP }}>
                                    <Map
                                        defaultState={{
                                            center: [trade.lat, trade.lon],
                                            zoom: 12
                                        }}
                                        width="100%"
                                        height="100%"
                                    >
                                        <Placemark
                                            geometry={[trade.lat, trade.lon]}
                                            properties={{
                                                balloonContent: trade.description
                                            }}
                                            options={{
                                                preset: trade.buyer_address ? 'islands#greenStretchyIcon' : 'islands#redStretchyIcon'
                                            }}
                                        />
                                    </Map>
                                </YMaps>
                            </div>
                            <p className="mt-4 text-sm text-gray-400">{trade.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TradeDetails; 