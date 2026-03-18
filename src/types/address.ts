export interface Address {
  id: number;
  userId: number;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  createdAt: string;
}

export interface CreateAddressInput {
  userId: number;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export type UpdateAddressInput = Partial<CreateAddressInput>;
