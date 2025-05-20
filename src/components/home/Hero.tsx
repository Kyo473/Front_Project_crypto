import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="px-4 py-16 md:px-8 lg:px-16 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Быстрый и безопасный <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">обмен криптовалют</span>
                </h1>
                <p className="text-lg text-gray-300 mb-8">
                    Торгуйте Bitcoin, Ethereum и другими криптовалютами на надежной платформе с низкими комиссиями.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
                    >
                        Начать торговлю
                    </button>
                    <button 
                        onClick={() => navigate('/about')}
                        className="px-6 py-3 rounded-lg border border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-white transition-colors font-medium"
                    >
                        Узнать больше
                    </button>
                </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md">
                    <svg className="w-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#818cf8" />
                            </linearGradient>
                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#38bdf8" />
                                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        {/* Фоновые элементы */}
                        <circle cx="200" cy="150" r="120" fill="rgba(30, 41, 59, 0.5)" />
                        <circle cx="200" cy="150" r="90" fill="rgba(30, 41, 59, 0.7)" />
                        
                        {/* Bitcoin символ */}
                        <g transform="translate(150, 100) scale(0.8)">
                            <circle cx="60" cy="60" r="60" fill="rgba(30, 41, 59, 0.9)" />
                            <path d="M85,40c0-11-9-15-19-16V10h-8v14h-6V10h-8v14H30v8h6c3,0,4,1,4,4v48c0,3-1,4-4,4h-6v8h14v14h8v-14h6v14h8v-14c16-1,25-7,25-19c0-9-4-15-13-17C83,53,85,47,85,40z M77,70c0,8-6,10-14,11V59C71,60,77,62,77,70z M67,40c0,7-5,9-12,9V31C62,32,67,33,67,40z" fill="url(#gradient)"/>
                        </g>
                        
                        {/* График линия */}
                        <polyline points="50,250 100,200 150,220 200,180 250,150 300,100 350,120" 
                                 fill="none" stroke="url(#gradient)" strokeWidth="3" />
                        
                        {/* График область */}
                        <polygon points="50,250 100,200 150,220 200,180 250,150 300,100 350,120 350,250 50,250" 
                                fill="url(#areaGradient)" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default Hero; 