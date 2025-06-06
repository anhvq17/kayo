import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'string.empty': 'Tên sản phẩm không được để trống',
      'any.required': 'Tên sản phẩm là bắt buộc',
    }),

  image: Joi.string()
    .required()
    .messages({
      'string.empty': 'Ảnh sản phẩm không được để trống',
      'any.required': 'Ảnh sản phẩm là bắt buộc',
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Giá phải là số',
      'number.min': 'Giá phải lớn hơn hoặc bằng 0',
      'any.required': 'Giá sản phẩm là bắt buộc',
    }),

  description: Joi.string()
    .required()
    .messages({
      'string.empty': 'Mô tả sản phẩm không được để trống',
      'any.required': 'Mô tả là bắt buộc',
    }),

  categoryId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      'string.length': 'ID danh mục phải đúng 24 ký tự',
      'string.hex': 'ID danh mục không hợp lệ',
      'any.required': 'categoryId là bắt buộc',
    }),

  brandId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      'string.length': 'ID thương hiệu phải đúng 24 ký tự',
      'string.hex': 'ID thương hiệu không hợp lệ',
      'any.required': 'brandId là bắt buộc',
    }),

  status: Joi.string()
    .valid('Còn hàng', 'Hết hàng')
    .default('Còn hàng')
    .messages({
      'any.only': 'Trạng thái chỉ có thể là "Còn hàng" hoặc "Hết hàng"',
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': 'Số lượng phải là số',
      'number.min': 'Số lượng phải lớn hơn hoặc bằng 0',
    }),

  flavors: Joi.array()
    .items(Joi.string().messages({
      'string.base': 'Phần tử trong flavors phải là chuỗi',
    }))
    .default([])
    .messages({
      'array.base': 'flavors phải là mảng',
    }),
});