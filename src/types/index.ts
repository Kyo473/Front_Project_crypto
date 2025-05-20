export interface CryptoCurrency {
    id: string;
    name: string;
    symbol: string;
    image: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
}

export interface CryptoDetails extends CryptoCurrency {
    description: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        facebook?: string;
        reddit?: string;
        telegram?: string;
    };
    priceHistory: {
        '24h': [number, number][];
        '7d': [number, number][];
        '30d': [number, number][];
        'all': [number, number][];
    };
    currentPrice: number;
    priceChange24h: number;
    totalVolume: number;
    high24h: number;
    low24h: number;
    ath: number;
    athDate: string;
    atl: number;
    atlDate: string;
    lastUpdated: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
}

export interface Trade {
    id: string;
    userId: string;
    cryptoId: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    timestamp: number;
}

export interface Review {
    id: number;
    name: string;
    initials: string;
    role: string;
    experience: string;
    text: string;
    rating: number;
    color: string;
}

export interface FAQ {
    id: number;
    question: string;
    answer: string;
} 