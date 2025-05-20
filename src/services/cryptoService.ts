import type { CryptoCurrency, CryptoDetails } from '../types';

const BINANCE_API = 'https://api.binance.com/api/v3';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const RATE_LIMIT_DELAY = 1000; // 1 second between requests

interface CacheItem<T> {
    data: T;
    timestamp: number;
    lastRequestTime: number;
}

interface BinanceTicker {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
    volume: string;
    highPrice: string;
    lowPrice: string;
}

interface BinanceKline {
    0: number; // Open time
    1: string; // Open
    2: string; // High
    3: string; // Low
    4: string; // Close
    5: string; // Volume
}

const cache: { [key: string]: CacheItem<any> } = {};
let lastRequestTime = 0;

const getCachedData = <T>(key: string): T | null => {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedData = <T>(key: string, data: T): void => {
    cache[key] = {
        data,
        timestamp: Date.now(),
        lastRequestTime: Date.now()
    };
};

const waitForRateLimit = async (): Promise<void> => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
    }
    
    lastRequestTime = Date.now();
};

const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await waitForRateLimit();
            const response = await fetch(url);
            
            if (response.ok) {
                return await response.json();
            }
            
            if (response.status === 429) {
                console.warn('Rate limit exceeded. Waiting...');
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
                continue;
            }
            
            throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
};

// Маппинг символов на имена криптовалют
const CRYPTO_NAMES: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'BNB': 'Binance Coin',
    'ADA': 'Cardano',
    'SOL': 'Solana',
    'XRP': 'Ripple',
    'DOT': 'Polkadot',
    'DOGE': 'Dogecoin',
    'AVAX': 'Avalanche',
    'MATIC': 'Polygon',
    'LINK': 'Chainlink',
    'UNI': 'Uniswap',
    'LTC': 'Litecoin',
    'ATOM': 'Cosmos',
    'XLM': 'Stellar',
    'ALGO': 'Algorand',
    'FIL': 'Filecoin',
    'VET': 'VeChain',
    'MANA': 'Decentraland',
    'SAND': 'The Sandbox',
    'AXS': 'Axie Infinity',
    'THETA': 'Theta Token',
    'EOS': 'EOS',
    'XTZ': 'Tezos',
    'AAVE': 'Aave',
    'CAKE': 'PancakeSwap',
    'MKR': 'Maker',
    'COMP': 'Compound',
    'SNX': 'Synthetix',
    'YFI': 'yearn.finance'
};

// Маппинг символов на пути к локальным иконкам
const CRYPTO_ICONS: { [key: string]: string } = {
    'BTC': '/src/assets/crypto-icons/btc.png',
    'ETH': '/src/assets/crypto-icons/eth.png',
    'BNB': '/src/assets/crypto-icons/bnb.png',
    'ADA': '/src/assets/crypto-icons/ada.png',
    'SOL': '/src/assets/crypto-icons/sol.png',
    'XRP': '/src/assets/crypto-icons/xrp.png',
    'DOT': '/src/assets/crypto-icons/dot.png',
    'DOGE': '/src/assets/crypto-icons/doge.png',
    'AVAX': '/src/assets/crypto-icons/avax.png',
    'MATIC': '/src/assets/crypto-icons/matic.png',
    'LINK': '/src/assets/crypto-icons/link.png',
    'UNI': '/src/assets/crypto-icons/uni.png',
    'LTC': '/src/assets/crypto-icons/ltc.png',
    'ATOM': '/src/assets/crypto-icons/atom.png',
    'XLM': '/src/assets/crypto-icons/xlm.png',
    'ALGO': '/src/assets/crypto-icons/algo.png',
    'FIL': '/src/assets/crypto-icons/fil.png',
    'VET': '/src/assets/crypto-icons/vet.png',
    'MANA': '/src/assets/crypto-icons/mana.png',
    'SAND': '/src/assets/crypto-icons/sand.png',
    'AXS': '/src/assets/crypto-icons/axs.png',
    'THETA': '/src/assets/crypto-icons/theta.png',
    'EOS': '/src/assets/crypto-icons/eos.png',
    'XTZ': '/src/assets/crypto-icons/xtz.png',
    'AAVE': '/src/assets/crypto-icons/aave.png',
    'CAKE': '/src/assets/crypto-icons/cake.png',
    'MKR': '/src/assets/crypto-icons/mkr.png',
    'COMP': '/src/assets/crypto-icons/comp.png',
    'SNX': '/src/assets/crypto-icons/snx.png',
    'YFI': '/src/assets/crypto-icons/yfi.png'
};

// Список популярных криптовалют
const POPULAR_SYMBOLS = [
    'BTCUSDT',  // Bitcoin
    'ETHUSDT',  // Ethereum
    'BNBUSDT',  // Binance Coin
    'ADAUSDT',  // Cardano
    'SOLUSDT',  // Solana
    'XRPUSDT',  // Ripple
    'DOTUSDT',  // Polkadot
    'DOGEUSDT', // Dogecoin
    'AVAXUSDT', // Avalanche
    'MATICUSDT', // Polygon
    'LINKUSDT', // Chainlink
    'UNIUSDT',  // Uniswap
    'LTCUSDT',  // Litecoin
    'ATOMUSDT', // Cosmos
    'XLMUSDT',  // Stellar
    'ALGOUSDT', // Algorand
    'FILUSDT',  // Filecoin
    'VETUSDT',  // VeChain
    'MANAUSDT', // Decentraland
    'SANDUSDT', // The Sandbox
    'AXSUSDT',  // Axie Infinity
    'THETAUSDT', // Theta Token
    'EOSUSDT',  // EOS
    'XTZUSDT',  // Tezos
    'AAVEUSDT', // Aave
    'CAKEUSDT', // PancakeSwap
    'MKRUSDT',  // Maker
    'COMPUSDT', // Compound
    'SNXUSDT',  // Synthetix
    'YFIUSDT'   // yearn.finance
];

// Маппинг символов на описания
const CRYPTO_DESCRIPTIONS: { [key: string]: string } = {
    'BTC': 'Bitcoin - первая и самая известная криптовалюта, созданная в 2009 году.',
    'ETH': 'Ethereum - платформа для создания децентрализованных приложений и смарт-контрактов.',
    'BNB': 'Binance Coin - нативная криптовалюта биржи Binance.',
    'ADA': 'Cardano - платформа для создания смарт-контрактов с фокусом на безопасность и масштабируемость.',
    'SOL': 'Solana - высокопроизводительный блокчейн для децентрализованных приложений.',
    'XRP': 'Ripple - криптовалюта для быстрых международных денежных переводов.',
    'DOT': 'Polkadot - протокол для взаимодействия между различными блокчейнами.',
    'DOGE': 'Dogecoin - криптовалюта, созданная как шутка, но ставшая популярной.',
    'AVAX': 'Avalanche - платформа для создания децентрализованных приложений с высокой производительностью.',
    'MATIC': 'Polygon - решение для масштабирования Ethereum.'
};

export const fetchCryptoData = async (limit: number = 10): Promise<CryptoCurrency[]> => {
    const cacheKey = `crypto_list_${limit}`;
    const cachedData = getCachedData<CryptoCurrency[]>(cacheKey);
    
    if (cachedData) {
        console.log('Using cached crypto data');
        return cachedData;
    }

    try {
        console.log('Fetching fresh crypto data');
        const symbols = POPULAR_SYMBOLS.slice(0, limit);
        const promises = symbols.map(symbol => 
            fetchWithRetry(`${BINANCE_API}/ticker/24hr?symbol=${symbol}`)
        );

        const results = await Promise.all(promises);
        
        const formattedData: CryptoCurrency[] = results.map((ticker: BinanceTicker, index) => {
            const symbol = symbols[index].replace('USDT', '');
            return {
                id: symbol.toLowerCase(),
                name: CRYPTO_NAMES[symbol] || symbol,
                symbol: symbol,
                image: `/src/assets/crypto-icons/${symbol.toLowerCase()}.png`,
                price: parseFloat(ticker.lastPrice),
                change24h: parseFloat(ticker.priceChangePercent),
                volume24h: parseFloat(ticker.volume),
                marketCap: parseFloat(ticker.lastPrice) * parseFloat(ticker.volume),
            };
        });

        setCachedData(cacheKey, formattedData);
        return formattedData;
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        throw error;
    }
};

export const fetchCryptoDetails = async (id: string): Promise<CryptoDetails> => {
    const cacheKey = `crypto_details_${id}`;
    const cachedData = getCachedData<CryptoDetails>(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        // Преобразуем id в правильный формат для Binance
        const symbol = id.toUpperCase() + 'USDT';
        const baseSymbol = id.toUpperCase();

        const [ticker, klines] = await Promise.all([
            fetchWithRetry(`${BINANCE_API}/ticker/24hr?symbol=${symbol}`),
            fetchWithRetry(`${BINANCE_API}/klines?symbol=${symbol}&interval=1d&limit=365`)
        ]);

        // Преобразуем данные для графика
        const allPrices = klines.map((k: BinanceKline) => [k[0], parseFloat(k[4])]);
        const priceHistory = {
            '24h': allPrices.slice(-24),
            '7d': allPrices.slice(-7),
            '30d': allPrices.slice(-30),
            'all': allPrices
        };

        const formattedData: CryptoDetails = {
            id: id,
            name: CRYPTO_NAMES[baseSymbol] || baseSymbol,
            symbol: baseSymbol,
            image: `/src/assets/crypto-icons/${id.toLowerCase()}.png`,
            price: parseFloat(ticker.lastPrice),
            change24h: parseFloat(ticker.priceChangePercent),
            volume24h: parseFloat(ticker.volume),
            marketCap: parseFloat(ticker.lastPrice) * parseFloat(ticker.volume),
            description: CRYPTO_DESCRIPTIONS[baseSymbol] || `${baseSymbol} - криптовалюта на Binance`,
            website: `https://www.binance.com/en/trade/${symbol}`,
            socialLinks: {
                twitter: undefined,
                reddit: undefined,
                telegram: undefined
            },
            priceHistory,
            currentPrice: parseFloat(ticker.lastPrice),
            priceChange24h: parseFloat(ticker.priceChangePercent),
            totalVolume: parseFloat(ticker.volume),
            high24h: parseFloat(ticker.highPrice),
            low24h: parseFloat(ticker.lowPrice),
            ath: parseFloat(ticker.highPrice),
            athDate: new Date().toISOString(),
            atl: parseFloat(ticker.lowPrice),
            atlDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        setCachedData(cacheKey, formattedData);
        return formattedData;
    } catch (error) {
        console.error('Error fetching crypto details:', error);
        throw error;
    }
};

export const fetchCryptoHistory = async (id: string, days: number): Promise<{ prices: [number, number][] }> => {
    const cacheKey = `crypto_history_${id}_${days}`;
    const cachedData = getCachedData<{ prices: [number, number][] }>(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        const symbol = id.toUpperCase() + 'USDT';
        const interval = days === 1 ? '1h' : '1d';
        const limit = days === 1 ? 24 : days;
        
        const response = await fetchWithRetry(
            `${BINANCE_API}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
        );

        const prices = response.map((k: BinanceKline) => [k[0], parseFloat(k[4])]);
        const data = { prices };
        
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error('Error fetching crypto history:', error);
        throw error;
    }
};

const getCryptoIcon = (symbol: string): string => {
    const icons: { [key: string]: string } = {
        btc: '₿',
        eth: 'Ξ',
        usdt: '$',
        bnb: 'B',
        sol: '◎',
        xrp: '✕',
        ada: '₳',
        doge: 'Ð'
    };
    return icons[symbol.toLowerCase()] || symbol.toUpperCase();
};

const getCryptoColor = (symbol: string): string => {
    const colors: { [key: string]: string } = {
        btc: 'bg-orange-500',
        eth: 'bg-blue-500',
        usdt: 'bg-green-500',
        bnb: 'bg-yellow-500',
        sol: 'bg-purple-500',
        xrp: 'bg-sky-500',
        ada: 'bg-indigo-500',
        doge: 'bg-amber-500'
    };
    return colors[symbol.toLowerCase()] || 'bg-slate-500';
};

const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toFixed(2);
};

const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `${(marketCap / 1e3).toFixed(2)}K`;
    return marketCap.toFixed(2);
}; 