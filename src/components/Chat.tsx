import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';

interface ChatProps {
    chatId: string;
}

interface Message {
    id: string;
    message: string;
    sender_id: string;
    chat_id: string;
    send_at: string;
}

interface Deal {
    id: string;
    participants: string[];
}

export const Chat: React.FC<ChatProps> = observer(({ chatId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!authStore.user || !authStore.accessToken) return;

        const checkAccess = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatroom/${chatId}`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.accessToken}`
                    }
                });
                
                if (!response.ok) {
                    setHasAccess(false);
                    setIsLoading(false);
                    return;
                }
                
                const chatData = await response.json();
                if (!authStore.user) {
                    setHasAccess(false);
                    setIsLoading(false);
                    return;
                }
                const isParticipant = chatData.seller_id === authStore.user.id || chatData.buyer_id === authStore.user.id;
                
                if (!isParticipant) {
                    setHasAccess(false);
                    setIsLoading(false);
                    return;
                }

                setHasAccess(true);
                setIsLoading(false);
                await getLastMessages();
            } catch (error) {
                console.error('Error checking access:', error);
                setHasAccess(false);
                setIsLoading(false);
            }
        };

        checkAccess();

        if (hasAccess && authStore.user) {
            const hostportDns = import.meta.env.VITE_BACKEND_URL.replace(/^https?:\/\//, '');
            const ws = new WebSocket(`ws://${hostportDns}/ws/${chatId}/${authStore.user.id}`);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                ws.send(JSON.stringify({ authorization: `Bearer ${authStore.accessToken}` }));
            };

            ws.onmessage = (event) => {
                try {
                    const match = event.data.match(/Client #([a-f0-9-]+) in Room/);
                    const newMessage: Message = {
                        id: Date.now().toString(),
                        message: event.data,
                        sender_id: match ? match[1] : 'unknown',
                        chat_id: chatId,
                        send_at: new Date().toISOString()
                    };
                    setMessages(prev => [...prev, newMessage].sort((a, b) => 
                        new Date(a.send_at).getTime() - new Date(b.send_at).getTime()
                    ));
                } catch (error) {
                    console.error('Error handling message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
            };

            ws.onclose = () => {
                setIsConnected(false);
            };
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [chatId, hasAccess]);

    const getLastMessages = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/last_messages/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${authStore.accessToken}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch messages');
            
            const data = await response.json();
            setMessages(data.sort((a: Message, b: Message) => 
                new Date(a.send_at).getTime() - new Date(b.send_at).getTime()
            ));
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !authStore.user || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        try {
            wsRef.current.send(JSON.stringify({
                content: newMessage.trim(),
                sender_id: authStore.user.id
            }));
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const parseMessageContent = (message: string): { content: string } => {
        try {
            const match = message.match(/says: ({.*})$/);
            if (match) {
                return JSON.parse(match[1]);
            }
            return { content: message };
        } catch {
            return { content: message };
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center text-gray-500">
                    <p className="text-lg font-semibold mb-2">Доступ запрещен</p>
                    <p>Вы не являетесь участником этой сделки</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[666px] bg-gray-50 rounded-lg">
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        Нет сообщений. Начните общение!
                    </div>
                ) : (
                    messages.map((message) => {
                        const { content } = parseMessageContent(message.message);
                        const isCurrentUser = message.sender_id === authStore.user?.id;
                        return (
                            <div
                                key={message.id || message.send_at}
                                className={`mb-4 ${
                                    isCurrentUser ? 'text-right' : 'text-left'
                                }`}
                            >
                                <div
                                    className={`inline-block p-3 rounded-lg ${
                                        isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {content}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(message.send_at).toLocaleTimeString()}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={isConnected ? "Введите сообщение..." : "Подключение..."}
                        disabled={!isConnected}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !isConnected}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Отправить
                    </button>
                </div>
            </form>
        </div>
    );
}); 