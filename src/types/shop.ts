import { Product } from "./product";

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
