import axios from "axios";

const API_URL = "http://localhost:3000/brands";

// Lấy danh sách thương hiệu
export const getBrands = () => axios.get(API_URL);

// Lấy chi tiết thương hiệu theo id
export const getBrandById = (id: number | string) => axios.get(`${API_URL}/${id}`);

// Thêm thương hiệu mới
export const createBrand = (data: any) => axios.post(API_URL, data);

// Cập nhật thương hiệu theo id
export const updateBrand = (id: number | string, data: any) =>
  axios.put(`${API_URL}/${id}`, data);

// Xoá thương hiệu theo id
export const deleteBrand = (id: number | string) => axios.delete(`${API_URL}/${id}`);
