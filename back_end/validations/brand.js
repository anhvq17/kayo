import Joi from "joi";

export const brandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên thương hiệu không được để trống",
    "string.min": "Tên thương hiệu phải có ít nhất 2 ký tự",
    "string.max": "Tên thương hiệu không vượt quá 100 ký tự",
    "any.required": "Tên thương hiệu là bắt buộc",
  }),
  image: Joi.string().uri().required().messages({
    "string.empty": "Hình ảnh không được để trống",
    "string.uri": "Hình ảnh phải là một URL hợp lệ",
    "any.required": "Hình ảnh là bắt buộc",
  }),
});
