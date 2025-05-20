import Navigation from '../components/layout/Navigation';

const Wallet = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Кошелек</h1>
        <div className="bg-slate-800 rounded-lg p-6">
          <p className="text-lg">Функционал кошелька находится в разработке.</p>
        </div>
      </main>
    </div>
  );
};

export default Wallet; 