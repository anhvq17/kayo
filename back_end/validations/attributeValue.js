import Joi from "joi";

export const attributeValueSchema = Joi.object({
  value: Joi.string()
    .required()
    .messages({
      "string.empty": "Giá trị không được để trống",
      "any.required": "Giá trị là bắt buộc"
    }),

  valueCode: Joi.string()
    .required()
    .messages({
      "string.empty": "Mã giá trị (valueCode) không được để trống",
      "any.required": "Mã giá trị là bắt buộc"
    }),

  attributeId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "ID thuộc tính phải có 24 ký tự",
      "string.hex": "ID thuộc tính không hợp lệ",
      "any.required": "attributeId là bắt buộc"
    })
});
