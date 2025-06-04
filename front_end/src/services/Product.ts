import axios from "axios";

const API_URL = "http://localhost:3000/products";

// Lấy danh sách sản phẩm
export const getProducts = () => axios.get(API_URL);

// Lấy chi tiết sản phẩm theo id
export const getProductById = (id: number | string) => axios.get(`${API_URL}/${id}`);

// Thêm sản phẩm mới
export const createProduct = (data: any) => axios.post(API_URL, data);

// Cập nhật sản phẩm theo id
export const updateProduct = (id: number | string, data: any) =>
  axios.put(`${API_URL}/${id}`, data);

// Xoá sản phẩm theo id
export const deleteProduct = (id: number | string) => axios.delete(`${API_URL}/${id}`);
