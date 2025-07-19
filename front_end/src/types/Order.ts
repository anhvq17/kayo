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
  fullAddress?: string; // Địa chỉ đầy đủ từ user
  province?: string;
  district?: string;
  ward?: string;
  detail?: string;
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
  orderStatus: 'Chờ xử lý' | 'Đã xử lý' | 'Đang giao hàng' | 'Đã giao hàng' | 'Đã nhận hàng' | 'Đã huỷ đơn hàng' | 'Yêu cầu hoàn hàng' | 'Đã hoàn hàng' | 'Từ chối hoàn hàng';
  totalAmount: number;
  originalAmount: number;
  paymentMethod: 'cod' | 'vnpay';
  paymentStatus: 'Đã thanh toán' | 'Chưa thanh toán' | 'Đã hoàn tiền';
  cancelReason?: string; // Lý do hủy đơn hàng
  returnReason?: string; // Lý do hoàn hàng
  createdAt: string;
  updatedAt: string;
  voucherCode?: string;
  discount?: number;
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
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