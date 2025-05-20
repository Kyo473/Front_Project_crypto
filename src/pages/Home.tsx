import React from "react";

const Home = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добро пожаловать в CryptoApp</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Торгуйте криптовалютой</h2>
          <p className="text-slate-300">
            Безопасная и удобная платформа для торговли криптовалютами
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Отслеживайте рынок</h2>
          <p className="text-slate-300">
            Актуальные цены и аналитика криптовалютного рынка
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Управляйте кошельком</h2>
          <p className="text-slate-300">
            Безопасное хранение и управление вашими активами
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
