import { makeAutoObservable } from 'mobx';
import { authStore } from './AuthStore';

class ChatStore {
    loading: boolean = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async createChatRoom(tradeId: string, sellerId: string) {
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
                    seller_id: sellerId
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

    getError() {
        return this.error;
    }

    isLoading() {
        return this.loading;
    }
}

export const chatStore = new ChatStore(); 