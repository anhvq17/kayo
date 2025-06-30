import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Tên sản phẩm không được để trống",
      "any.required": "Tên sản phẩm là bắt buộc",
    }),

  description: Joi.string()
    .required()
    .messages({
      "string.empty": "Mô tả không được để trống",
      "any.required": "Mô tả là bắt buộc",
    }),

  image: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Ảnh không được để trống",
      "string.uri": "Ảnh phải là một URL hợp lệ",
      "any.required": "Ảnh là bắt buộc",
    }),

  priceDefault: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Giá phải là số",
      "number.positive": "Giá phải lớn hơn 0",
      "any.required": "Giá mặc định là bắt buộc",
    }),

  categoryId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "ID danh mục phải có 24 ký tự",
      "string.hex": "ID danh mục không hợp lệ",
      "any.required": "categoryId là bắt buộc",
    }),

  brandId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "ID thương hiệu phải có 24 ký tự",
      "string.hex": "ID thương hiệu không hợp lệ",
      "any.required": "ID thương hiệu là bắt buộc",
    }),


});
