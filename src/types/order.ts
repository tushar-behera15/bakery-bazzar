export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  method: string;
  createdAt: string;
}

export interface Order {
  id: number;
  buyerId: number;
  addressId: number;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  buyerId: number;
  addressId: number;
  items: {
    productId: number;
    price: number;
    quantity: number;
  }[];
  idempotencyKey?: string;
}

export interface AddOrderItemInput {
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
}
