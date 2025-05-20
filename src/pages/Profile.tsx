import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../stores/AuthStore';

const Profile: React.FC = observer(() => {
    const navigate = useNavigate();
    const { user, logout } = authStore;

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
                </div>
            </main>
        </div>
    );
});

export default Profile; 