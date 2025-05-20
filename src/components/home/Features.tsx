import React from 'react';

const Features: React.FC = () => {
    return (
        <section className="px-4 py-16 md:px-8 lg:px-16 bg-slate-900">
            <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="w-12 h-12 bg-sky-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
                    <p className="text-gray-300">Защита средств клиентов с помощью передовых технологий шифрования и многофакторной аутентификации.</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="w-12 h-12 bg-sky-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Скорость</h3>
                    <p className="text-gray-300">Мгновенные транзакции и быстрое исполнение ордеров благодаря высокопроизводительной системе.</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                    <div className="w-12 h-12 bg-sky-500 bg-opacity-20 rounded-lg flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Низкие комиссии</h3>
                    <p className="text-gray-300">Конкурентные тарифы на все операции с прозрачной структурой комиссий без скрытых платежей.</p>
                </div>
            </div>
        </section>
    );
};

export default Features; 