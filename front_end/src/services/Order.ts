import axios from "axios";
import type { CreateOrderPayload, Order } from "../types/Order";

const API_URL = "http://localhost:3000";

export const createOrder = async (orderData: any) => {
  const res = await axios.post(`${API_URL}/orders`, orderData);
  return res.data;
};

export const getOrders = async () => {
  const res = await axios.get(`${API_URL}/orders`);
  return res.data;
};

export const getOrderById = async (orderId: string) => {
  const res = await axios.get(`${API_URL}/orders/${orderId}`);
  return res.data;
};

export const getOrdersByUser = async (userId: string) => {
  const res = await axios.get(`${API_URL}/orders/user/${userId}`);
  return res.data;
};

export const getOrdersByUserWithItems = async (userId: string) => {
  const res = await axios.get(`${API_URL}/orders/user/${userId}/full`);
  return res.data;
};

export const updateOrder = async (orderId: string, updateData: Partial<Order>) => {
  const res = await axios.put(`${API_URL}/orders/${orderId}`, updateData);
  return res.data;
};

export const createVNPayUrl = async (amount: number, orderId?: string) => {
  const params: any = { amount };
  if (orderId) {
    params.orderId = orderId;
  }
  const res = await axios.get(`${API_URL}/payment/create_payment`, { params });
  return res.data;
};

export const checkPayment = async (queryString: string) => {
  const res = await axios.get(`${API_URL}/payment/check_payment?${queryString}`);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await axios.get(`${API_URL}/orders`);
  return res.data;
};
 