export interface Wallet {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: "cash",
    name: "Tiền mặt",
    balance: 0,
    icon: "zi-star",
    color: "#10b981",
  },
  {
    id: "bank",
    name: "Ngân hàng",
    balance: 0,
    icon: "zi-user-circle",
    color: "#3b82f6",
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    balance: 0,
    icon: "zi-user-circle-solid",
    color: "#006af5",
  },
];
