export interface Investment {
    id: number;
    coinName: string;
    amount: number;
    purchaseDate: string;
    duration: number;
    maturityDate: string;
    status: 'active' | 'withdrawn' | 'matured';
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    total_account_balance: number;
    investment_balance: number;
    investments?: Investment[];
}

export interface Coin {
    symbol: string;
    name: string;
    current_price: number;
}
