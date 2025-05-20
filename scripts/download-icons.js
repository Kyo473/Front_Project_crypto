import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS = {
    'btc': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    'eth': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    'bnb': 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    'ada': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    'sol': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    'xrp': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    'dot': 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    'doge': 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    'avax': 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png',
    'matic': 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png',
    'link': 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    'uni': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
    'ltc': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
    'atom': 'https://assets.coingecko.com/coins/images/1405/large/cosmos_hub.png',
    'xlm': 'https://assets.coingecko.com/coins/images/100/large/stellar.png',
    'algo': 'https://assets.coingecko.com/coins/images/4380/large/download.png',
    'fil': 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png',
    'vet': 'https://assets.coingecko.com/coins/images/1167/large/VeChain-Logo-768x725.png',
    'mana': 'https://assets.coingecko.com/coins/images/878/large/decentraland-mana.png',
    'sand': 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg',
    'axs': 'https://assets.coingecko.com/coins/images/13025/large/axie_infinity_logo.png',
    'theta': 'https://assets.coingecko.com/coins/images/2538/large/theta-token-logo.png',
    'eos': 'https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png',
    'xtz': 'https://assets.coingecko.com/coins/images/976/large/Tezos-logo.png',
    'aave': 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png',
    'cake': 'https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png',
    'mkr': 'https://assets.coingecko.com/coins/images/1364/large/mark_dao.png',
    'comp': 'https://assets.coingecko.com/coins/images/10775/large/COMP.png',
    'snx': 'https://assets.coingecko.com/coins/images/3406/large/SNX.png',
    'yfi': 'https://assets.coingecko.com/coins/images/11849/large/yfi-192x192.png'
};

const downloadIcon = (symbol, url) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, '../src/assets/crypto-icons', `${symbol}.png`);
        const file = fs.createWriteStream(filePath);

        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${symbol} icon`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            console.error(`Error downloading ${symbol} icon:`, err.message);
            reject(err);
        });
    });
};

const downloadAllIcons = async () => {
    const iconsDir = path.join(__dirname, '../src/assets/crypto-icons');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }

    console.log('Starting icon downloads...');
    
    for (const [symbol, url] of Object.entries(ICONS)) {
        try {
            await downloadIcon(symbol, url);
        } catch (error) {
            console.error(`Failed to download ${symbol} icon:`, error);
        }
    }
    
    console.log('All icons downloaded!');
};

downloadAllIcons(); 