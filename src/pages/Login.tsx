import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Здесь будет логика авторизации
            console.log('Login attempt:', { email, password });
            navigate('/profile');
        } catch (err) {
            setError('Ошибка при входе. Проверьте правильность данных.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-center">Вход в систему</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Войти
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-gray-400">
                            Нет аккаунта?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                Зарегистрироваться
                            </button>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login; 