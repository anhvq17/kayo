import Joi from "joi";

export const attributeSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên thuộc tính không được để trống",
    "any.required": "Tên thuộc tính là bắt buộc",
  }),
  attributeCode: Joi.string().required().messages({
    "string.empty": "Mã thuộc tính không được để trống",
    "any.required": "Mã thuộc tính là bắt buộc",
  }),
  description: Joi.string().allow("").optional().messages({
    "string.base": "Mô tả phải là chuỗi",
  }),
});
