import React from 'react';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CryptoTable from '../components/crypto/CryptoTable';
import FAQ from '../components/home/FAQ';

const GuestLanding: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Hero />
            <Features />
            <CryptoTable />
            <FAQ />
            <footer className="bg-slate-800 text-white text-center py-8 mt-8">
                <p>© 2025 FastexChange. Все права защищены.</p>
                <p className="text-sm text-gray-400 mt-2">Сделано для крипто-свободы</p>
            </footer>
        </div>
    );
};

export default GuestLanding;
