import { Product } from "./product";

export interface RawProductImage {
    url: string;
}

export interface RawProduct {
    images: RawProductImage[];
}

export interface RawShop {
    id: number;
    name: string;
    description?: string;
    address?: string;
    products?: RawProduct[];
    latitude?: number | null;
    longitude?: number | null;
    distance?: number | null;
}

export interface Shop {
    id: number;
    name: string;
    address: string;
    description?: string;
    contactEmail: string;
    contactNumber?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    owner: {
        id: number;
        name: string;
    };
    products: Product[];
}
