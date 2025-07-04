export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  volume: string;
  fragrance: string;
  image: { src: string };
}

export interface Address {
  province: string;
  district: string;
  ward: string;
  detail: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: {
    province: string;
    district: string;
    ward: string;
    detailAddress: string;
  };
}
  
export interface CreateOrderPayload {
  userId: string;
  items: {
    variantId: string;
    quantity: number;
    price: number;
  }[];
  shippingInfo: ShippingInfo;
  paymentMethod: 'cod' | 'vnpay';
}

export interface Order {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  address: Address;
  status: 'pending' | 'processed' | 'shipping' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  paymentMethod: 'cod' | 'vnpay';
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  _id: string;
  variantId: {
    _id: string;
    image: string;
    productId: {
      _id: string;
      name: string;
      image: string;
    };
    attributes?: {
      attributeId: {
        _id: string;
        name: string;
      };
      valueId: {
        _id: string;
        value: string;
      };
    }[];
  };
  quantity: number;
  price: number;
}
