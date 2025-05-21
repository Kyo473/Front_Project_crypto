import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { tradeStore } from '../stores/TradeStore';
import { authStore } from '../stores/AuthStore';
import { chatStore } from '../stores/ChatStore';
import Map from '../components/Map';
import { Chat } from '../components/Chat';
import { Spinner } from '../components/Spinner';

const TradeDetails: React.FC = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trade, setTrade] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccepting, setIsAccepting] = useState(false);
    const [chatRoom, setChatRoom] = useState<any>(null);
    const [isLoadingChat, setIsLoadingChat] = useState(true);

    useEffect(() => {
        const loadTrade = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                // Сначала проверяем локальное хранилище
                const trade = tradeStore.getTrades().find(t => t.id === id);
                if (trade) {
                    setTrade(trade);
                } else {
                    // Если сделка не найдена локально, загружаем с сервера
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trades/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${authStore.accessToken}`
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Trade not found');
                    }
                    
                    const tradeData = await response.json();
                    setTrade(tradeData);
                }
            } catch (error) {
                console.error('Error loading trade:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const checkChat = async () => {
            if (!id) return;
            setIsLoadingChat(true);
            const chat = await chatStore.getChatRoom(id);
            setChatRoom(chat);
            setIsLoadingChat(false);
        };

        loadTrade();
        checkChat();
    }, [id]);

    const handleAcceptTrade = async () => {
        if (!id || !authStore.user) return;
        
        try {
            setIsAccepting(true);
            await tradeStore.acceptTrade(id);
            navigate('/p2p-trades');
        } catch (error) {
            console.error('Error accepting trade:', error);
        } finally {
            setIsAccepting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (!trade) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Сделка не найдена</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Детали сделки</h1>
                    <button
                        onClick={() => navigate('/p2p-trades')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        ← Назад к списку
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Тип сделки</h2>
                                <p className="text-gray-600">{trade.hide === 'Create' ? 'Покупка' : 'Продажа'}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Криптовалюта</h2>
                                <p className="text-gray-600">{trade.currency}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Сумма</h2>
                                <p className="text-gray-600">{trade.amount} {trade.currency}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Цена</h2>
                                <p className="text-gray-600">{trade.price} ₽</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Способ оплаты</h2>
                                <p className="text-gray-600">{trade.description}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Продавец</h2>
                                <p className="text-gray-600">{trade.seller_address}</p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Статус</h2>
                                <p className="text-gray-600">{tradeStore.mapHideStatusToTradeStatus(trade.hide)}</p>
                            </div>
                        </div>

                        {trade.hide === 'Create' && authStore.user && authStore.user.id !== trade.seller_id && (
                            <div className="mt-6">
                                <button
                                    onClick={handleAcceptTrade}
                                    disabled={isAccepting}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAccepting ? 'Принятие...' : 'Принять сделку'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Местоположение</h2>
                        <div className="h-64 rounded-lg overflow-hidden">
                            <Map
                                center={[trade.lat, trade.lon]}
                                zoom={13}
                                markers={[{
                                    id: trade.id,
                                    position: [trade.lat, trade.lon],
                                    title: trade.description,
                                    description: `${trade.amount} ${trade.currency} за ${trade.price} ₽`
                                }]}
                            />
                        </div>
                    </div>
                </div>

                {isLoadingChat ? (
                    <div className="mt-8 flex justify-center">
                        <Spinner />
                    </div>
                ) : chatRoom && chatRoom.buyer_id ? (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Чат</h2>
                        <Chat chatId={chatRoom.id} />
                    </div>
                ) : null}
            </div>
        </div>
    );
});

export default TradeDetails; 