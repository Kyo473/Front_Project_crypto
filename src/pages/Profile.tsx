import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';

interface Trade {
    id: string;
    buyer_id: string;
    seller_id: string;
    buyer_address: string;
    seller_address: string;
    price: number;
    amount: number;
    currency: string;
    created_at: string;
    description: string;
    lat: number;
    lon: number;
    hide: string;
}

const Profile: React.FC = observer(() => {
    const navigate = useNavigate();
    const { user, logout } = authStore;
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrades = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trades?skip=0&limit=100`, {
                    headers: {
                        'Authorization': `Bearer ${authStore.accessToken}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch trades');
                
                const data = await response.json();
                // Фильтруем сделки, где пользователь является либо покупателем, либо продавцом
                const userTrades = data.filter((trade: Trade) => 
                    trade.buyer_id === user.id || trade.seller_id === user.id
                );
                setTrades(userTrades);
            } catch (error) {
                console.error('Error fetching trades:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrades();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
            try {
                // TODO: Implement account deletion
                logout();
                navigate('/login');
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p>Пожалуйста, войдите в систему</p>
            </div>
        );
    }

    // Format registration date
    const registrationDate = new Date(user.registered_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Профиль</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Выйти
                        </button>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-6">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Email
                                        </label>
                                        <p className="text-white">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Имя пользователя
                                        </label>
                                        <p className="text-white">{user.username}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Адрес кошелька
                                        </label>
                                        <p className="text-white">{user.address}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Статус верификации
                                        </label>
                                        <p className="text-white">
                                            {user.is_verified ? 'Верифицирован' : 'Не верифицирован'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Дата регистрации
                                        </label>
                                        <p className="text-white">{registrationDate}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Настройки</h2>
                                <div className="space-y-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Изменить пароль
                                    </button>
                                    <button 
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-4"
                                    >
                                        Удалить аккаунт
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-6">Мои сделки</h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : trades.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">У вас пока нет сделок</p>
                        ) : (
                            <div className="bg-slate-800 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-700/50">
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Тип</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Криптовалюта</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Сумма</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Цена</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Статус</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Дата</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {trades.map((trade) => (
                                                <tr key={trade.id} className="hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            trade.buyer_id === user?.id ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {trade.buyer_id === user?.id ? 'Покупка' : 'Продажа'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.currency}</td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.amount}</td>
                                                    <td className="px-6 py-4 text-gray-300">{trade.price.toLocaleString()} ₽</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            trade.hide === 'Create' ? 'bg-blue-500/20 text-blue-400' :
                                                            trade.hide === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            trade.hide === 'Successful' ? 'bg-green-500/20 text-green-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>
                                                            {trade.hide}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300">
                                                        {new Date(trade.created_at).toLocaleDateString('ru-RU')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => navigate(`/p2p-trades/${trade.id}`)}
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
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
});

export default Profile; 