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
  orderStatus: 'Chờ xử lý' | 'Đã xử lý' | 'Đang giao hàng' | 'Đã giao hàng' | 'Đã nhận hàng' | 'Đã huỷ đơn hàng';
  totalAmount: number;
  paymentMethod: 'cod' | 'vnpay';
  paymentStatus: 'Đã thanh toán' | 'Chưa thanh toán';
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
