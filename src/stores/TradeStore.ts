import { makeAutoObservable } from 'mobx';
import { authStore } from './AuthStore';

export interface Trade {
    id: string;
    type: 'buy' | 'sell';
    cryptocurrency: string;
    amount: number;
    price: number;
    paymentMethod: string;
    user: string;
    status: 'active' | 'completed' | 'cancelled';
    location?: {
        coordinates: [number, number];
        address: string;
    };
}

class TradeStore {
    trades: Trade[] = [];
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    private transformTradeData(tradeData: any): Trade {
        return {
            id: tradeData.id,
            type: tradeData.buyer_address ? 'buy' : 'sell',
            cryptocurrency: tradeData.currency,
            amount: 0,
            price: tradeData.price,
            paymentMethod: 'Bank Transfer',
            user: tradeData.seller_address,
            status: this.mapHideStatusToTradeStatus(tradeData.hide),
            location: {
                coordinates: [tradeData.lat, tradeData.lon],
                address: tradeData.description || 'Адрес не указан'
            }
        };
    }

    private mapHideStatusToTradeStatus(hideStatus: string): 'active' | 'completed' | 'cancelled' {
        switch (hideStatus) {
            case 'Create':
                return 'active';
            case 'Successful':
                return 'completed';
            case 'Error':
                return 'cancelled';
            default:
                return 'active';
        }
    }

    async fetchTrades(skip: number = 0, limit: number = 100) {
        try {
            this.loading = true;
            this.error = null;

            if (!authStore.isAuthenticated || !authStore.accessToken) {
                this.error = 'Требуется авторизация';
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trades?skip=${skip}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${authStore.accessToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.error = 'Требуется авторизация';
                    authStore.logout();
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            this.trades = data.map((trade: any) => this.transformTradeData(trade));
        } catch (error) {
            console.error('Error fetching trades:', error);
            this.error = 'Ошибка при загрузке сделок';
        } finally {
            this.loading = false;
        }
    }

    getTrades() {
        return this.trades;
    }

    isLoading() {
        return this.loading;
    }

    getError() {
        return this.error;
    }
}

export const tradeStore = new TradeStore();
