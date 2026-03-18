export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    imageUrl?: string;
    shopId?: number;
    createdAt?: string;
    updatedAt?: string;
}
