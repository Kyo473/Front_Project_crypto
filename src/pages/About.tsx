import React from 'react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            О проекте
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Инновационная платформа для работы с криптовалютами
                        </p>
                    </div>
                    
                    <div className="space-y-12">
                        <section className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold">Наша миссия</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Мы стремимся сделать криптовалютный рынок более доступным и понятным для каждого. 
                                Наша платформа предоставляет удобные инструменты для отслеживания, анализа и 
                                управления криптовалютными активами.
                            </p>
                        </section>

                        <section className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold">Что мы предлагаем</h2>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                                <li className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Реальное время отслеживания цен</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Детальную аналитику и графики</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Безопасное хранение данных</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Удобный интерфейс управления</span>
                                </li>
                            </ul>
                        </section>

                        <section className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold">Безопасность</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Безопасность наших пользователей - наш главный приоритет. Мы используем 
                                современные методы шифрования и защиты данных, чтобы обеспечить максимальную 
                                безопасность ваших активов и личной информации.
                            </p>
                        </section>

                        <section className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold">Свяжитесь с нами</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Если у вас есть вопросы или предложения, мы всегда готовы помочь. 
                                Свяжитесь с нами через форму обратной связи или по электронной почте.
                            </p>
                            <div className="mt-6">
                                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                                    Написать нам
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 