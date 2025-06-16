import Joi from "joi";

export const productVariantSchema = Joi.object({
  productId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      'string.length': 'productId phải có đúng 24 ký tự',
      'string.hex': 'productId không hợp lệ',
      'any.required': 'productId là bắt buộc',
    }),

  volume: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Dung tích (ml) phải là số',
      'number.min': 'Dung tích phải lớn hơn 0',
      'any.required': 'Dung tích là bắt buộc',
    }),

  price: Joi.number()
    .min(1)
    .required()
    .messages({
      'number.base': 'Giá phải là số',
      'number.min': 'Giá phải lớn hơn 0',
      'any.required': 'Giá là bắt buộc',
    }),

  stock_quantity: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'Số lượng phải là số',
      'number.min': 'Số lượng phải lớn hơn 0',
    }),

  image: Joi.string()
    .required()
    .messages({
      'string.empty': 'Ảnh là bắt buộc',
      'any.required': 'Ảnh là bắt buộc',
    }),

  flavors: Joi.string()
    .required()
    .messages({
      'string.empty': 'Hương vị là bắt buộc',
      'any.required': 'Hương vị là bắt buộc',
    }),
});
