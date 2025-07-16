import Joi from "joi";

export const voucherSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .required()
    .pattern(/^[A-Z0-9-_]+$/)
    .messages({
      "string.empty": "Mã voucher không được để trống",
      "any.required": "Mã voucher là bắt buộc",
      "string.pattern.base": "Mã voucher chỉ bao gồm chữ in hoa, số, dấu gạch ngang hoặc gạch dưới",
    }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Mô tả phải là chuỗi",
  }),

  discountType: Joi.string()
    .valid("percent", "fixed")
    .required()
    .messages({
      "any.only": "Loại giảm giá chỉ được là 'percent' hoặc 'fixed'",
      "any.required": "Loại giảm giá là bắt buộc",
    }),

  discountValue: Joi.number().min(1).required().messages({
    "number.base": "Giá trị giảm giá phải là số",
    "number.min": "Giá trị giảm giá phải > 0",
    "any.required": "Giá trị giảm giá là bắt buộc",
  }),

  minOrderValue: Joi.number().min(1).optional().messages({
    "number.base": "Giá trị đơn hàng tối thiểu phải là số",
    "number.min": "Giá trị đơn hàng tối thiểu phải > 0",
  }),

  maxDiscountValue: Joi.number().allow(null).optional().messages({
    "number.base": "Giá trị giảm giá tối đa phải là số hoặc null",
  }),

  startDate: Joi.date().required().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
    "any.required": "Ngày bắt đầu là bắt buộc",
  }),

  endDate: Joi.date()
    .required()
    .custom((value, helpers) => {
      const { startDate } = helpers.state.ancestors[0];
      if (startDate && new Date(value) <= new Date(startDate)) {
        return helpers.error("date.lessThanStart");
      }
      return value;
    })
    .messages({
      "date.base": "Ngày kết thúc không hợp lệ",
      "any.required": "Ngày kết thúc là bắt buộc",
      "date.lessThanStart": "Ngày kết thúc phải sau ngày bắt đầu",
    }),

  usageLimit: Joi.number().integer().min(1).allow(null).optional().messages({
    "number.base": "Số lần sử dụng phải là số",
    "number.min": "Số lần sử dụng phải >= 1",
  }),

  usedCount: Joi.number().integer().min(0).optional(),

  status: Joi.string().valid("activated", "inactivated").required().messages({
    "any.only": "Trạng thái chỉ có thể là 'activated' hoặc 'inactivated'",
    "any.required": "Trạng thái là bắt buộc",
  }),
});
