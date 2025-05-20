export type Currency = "BTC" | "MATIC" | "USDT";
export type HideStatus = "Create" | "Pending" | "Successful" | "Appilation" | "Error";

export interface TradeRead {
  id: string;
  buyer_address?: string;
  seller_address: string;
  price: number;
  currency: Currency;
  created_at: string;
  description: string;
  lat: number;
  lon: number;
  hide: HideStatus;
}
