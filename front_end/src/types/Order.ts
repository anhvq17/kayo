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
  fullAddress?: string;
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
  paymentMethod: 'cod' | 'vnpay' | 'wallet';
}

export interface Order {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  address: Address;
  orderStatus: 'Chờ xử lý' | 'Đã xử lý' | 'Đang giao hàng' | 'Đã giao hàng' | 'Đã nhận hàng' | 'Đã huỷ đơn hàng' | 'Yêu cầu hoàn hàng' | 'Đã hoàn hàng' | 'Từ chối hoàn hàng';
  totalAmount: number;
  originalAmount: number;
  paymentMethod: 'cod' | 'vnpay' | 'wallet';
  paymentStatus: 'Đã thanh toán' | 'Chưa thanh toán' | 'Đã hoàn tiền';
  cancelReason?: string;
  returnReason?: string;
  createdAt: string;
  updatedAt: string;
  voucherCode?: string;
  discount?: number;
  discountType?: 'percent' | 'fixed';
  discountValue?: number;
}