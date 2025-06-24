import Joi from "joi";

export const attributeSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên thuộc tính không được để trống",
    "any.required": "Tên thuộc tính là bắt buộc",
  }),
  attributeCode: Joi.string()
    .pattern(/^[a-zA-Z0-9-_]+$/)
    .required()
    .messages({
      "string.empty": "Mã thuộc tính không được để trống",
      "any.required": "Mã thuộc tính là bắt buộc",
      "string.pattern.base": "Mã chỉ bao gồm chữ, số, gạch ngang hoặc gạch dưới"
    }),
  description: Joi.string().allow("").optional().messages({
    "string.base": "Mô tả phải là chuỗi",
  }),
});
