import { CartItem } from '../../cart/models';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: string;
  total: number;
};

export interface AddressDto {
  address: string;
  comment: string;
  firstName: string;
  lastName: string;
}

export interface StatusHistoryDto {
  status: string;
  timestamp: Date;
  comment: string;
  osh_id?: string;
}

export interface OrderDto {
  id?: string;
  items: { productId: string; count: number }[];
  address: AddressDto | undefined;
  statusHistory?: StatusHistoryDto[];
}
