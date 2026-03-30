export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    low_stock_threshold: number;
    category?: string;
    imageUrl?: string;
    shopId?: number;
    createdAt?: string;
    updatedAt?: string;
}
