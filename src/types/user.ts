export type UserRole = "ADMIN" | "SELLER" | "USER";

export interface User {
    id: number | string;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}
