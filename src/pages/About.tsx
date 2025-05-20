import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';

const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Navigation />
            <div className="px-4 py-16 md:px-8 lg:px-16">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">
                        О <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">нас</span>
                    </h1>
                    
                    <div className="space-y-8">
                        <div className="bg-slate-800 rounded-xl p-8">
                            <h2 className="text-2xl font-semibold mb-4">Наша миссия</h2>
                            <p className="text-gray-300 leading-relaxed">
                                Мы стремимся сделать криптовалютный рынок доступным для каждого. Наша платформа 
                                предоставляет безопасный и удобный способ торговли цифровыми активами, 
                                объединяя передовые технологии с простым пользовательским интерфейсом.
                            </p>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-8">
                            <h2 className="text-2xl font-semibold mb-4">Наши преимущества</h2>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-sky-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Безопасность на первом месте - мы используем передовые технологии защиты</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-sky-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Низкие комиссии и прозрачные условия торговли</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-sky-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Круглосуточная поддержка клиентов</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-8">
                            <h2 className="text-2xl font-semibold mb-4">Наша команда</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Мы - команда профессионалов с многолетним опытом в области криптовалют 
                                и финансовых технологий. Наша цель - создать лучшую платформу для 
                                торговли цифровыми активами.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-sky-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                                        АК
                                    </div>
                                    <h3 className="font-semibold">Алексей К.</h3>
                                    <p className="text-gray-400">CEO & Основатель</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                                        МС
                                    </div>
                                    <h3 className="font-semibold">Мария С.</h3>
                                    <p className="text-gray-400">CTO</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                                        ДП
                                    </div>
                                    <h3 className="font-semibold">Дмитрий П.</h3>
                                    <p className="text-gray-400">Head of Security</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
                        >
                            Вернуться на главную
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 