import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white">

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Профиль</h1>
                    <div className="bg-slate-800 rounded-lg p-6">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Email
                                        </label>
                                        <p className="text-white">user@example.com</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Дата регистрации
                                        </label>
                                        <p className="text-white">01.01.2024</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Настройки</h2>
                                <div className="space-y-4">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Изменить пароль
                                    </button>
                                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-4">
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
};

export default Profile; 