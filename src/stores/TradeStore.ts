import { makeAutoObservable } from 'mobx';
import { authStore } from './AuthStore';

export interface Trade {
    id: string;
    buyer_address: string;
    seller_address: string;
    price: number;
    amount: number;
    currency: string;
    created_at: string;
    description: string;
    lat: number;
    lon: number;
    hide: string;
}

export interface CreateTradeData {
    seller_id: string;
    seller_address: string;
    price: number;
    currency: string;
    description: string;
    lat: number;
    lon: number;
    hide: string;
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
            buyer_address: tradeData.buyer_address || '',
            seller_address: tradeData.seller_address,
            price: tradeData.price,
            amount: tradeData.amount,
            currency: tradeData.currency,
            created_at: tradeData.created_at,
            description: tradeData.description,
            lat: tradeData.lat,
            lon: tradeData.lon,
            hide: tradeData.hide
        };
    }

    public mapHideStatusToTradeStatus(hide: string): string {
        switch (hide) {
            case 'Create':
                return 'Активна';
            case 'Pending':
                return 'В процессе';
            case 'Successful':
                return 'Завершена';
            default:
                return 'Отменена';
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

    async createTrade(tradeData: CreateTradeData) {
        try {
            this.loading = true;
            this.error = null;

            if (!authStore.isAuthenticated || !authStore.accessToken || !authStore.user) {
                this.error = 'Требуется авторизация';
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trade`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify(tradeData)
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

            const newTrade = await response.json();
            this.trades.push(this.transformTradeData(newTrade));

            // Создаем чат после успешного создания сделки
            await this.createChatRoom(authStore.user.id, '', newTrade.id);

            return newTrade;
        } catch (error) {
            console.error('Error creating trade:', error);
            this.error = 'Ошибка при создании сделки';
            throw error;
        } finally {
            this.loading = false;
        }
    }

    async createChatRoom(sellerId: string, buyerId: string, tradeId: string) {
        try {
            if (!authStore.isAuthenticated || !authStore.accessToken) {
                this.error = 'Требуется авторизация';
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatroom`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify({
                    id: tradeId,
                    seller_id: sellerId,
                    ...(buyerId && { buyer_id: buyerId })
                })
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

            return await response.json();
        } catch (error) {
            console.error('Error creating chat room:', error);
            this.error = 'Ошибка при создании чата';
            throw error;
        }
    }

    async joinChatRoom(chatId: string, buyerId: string) {
        try {
            if (!authStore.isAuthenticated || !authStore.accessToken) {
                this.error = 'Требуется авторизация';
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatroom/${chatId}/join?buyer_id=${buyerId}`, {
                method: 'PATCH',
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

            return await response.json();
        } catch (error) {
            console.error('Error joining chat room:', error);
            this.error = 'Ошибка при присоединении к чату';
            throw error;
        }
    }

    async acceptTrade(tradeId: string) {
        try {
            this.loading = true;
            this.error = null;

            if (!authStore.isAuthenticated || !authStore.accessToken || !authStore.user) {
                this.error = 'Требуется авторизация';
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trades/${tradeId}/accept`, {
                method: 'PATCH',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.accessToken}`
                },
                body: JSON.stringify({
                    buyer_id: authStore.user.id,
                    buyer_address: authStore.user.address,
                    hide: 'Pending'
                })
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

            // Обновляем статус сделки в локальном списке
            const updatedTrade = await response.json();
            const index = this.trades.findIndex(t => t.id === tradeId);
            if (index !== -1) {
                this.trades[index] = this.transformTradeData(updatedTrade);
            }

            // Присоединяемся к чату
            await this.joinChatRoom(tradeId, authStore.user.id);

            return updatedTrade;
        } catch (error) {
            console.error('Error accepting trade:', error);
            this.error = 'Ошибка при принятии сделки';
            throw error;
        } finally {
            this.loading = false;
        }
    }

    async getChatRoom(tradeId: string) {
        try {
            if (!authStore.isAuthenticated || !authStore.accessToken) {
                this.error = 'Требуется авторизация';
                return null;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chatroom/${tradeId}`, {
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
                } else if (response.status === 404) {
                    return null;
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting chat room:', error);
            this.error = 'Ошибка при получении чата';
            return null;
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
