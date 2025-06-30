import Joi from "joi";

export const variantSchema = Joi.object({
  productId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.length": "ID sản phẩm phải có đúng 24 ký tự",
      "string.hex": "ID sản phẩm không hợp lệ",
      "any.required": "productId là bắt buộc",
      "string.empty": "productId không được để trống"
    }),

  attributes: Joi.array()
    .items(
      Joi.object({
        attributeId: Joi.string()
          .length(24)
          .hex()
          .required()
          .messages({
            "string.length": "attributeId phải có đúng 24 ký tự",
            "string.hex": "attributeId không hợp lệ",
            "any.required": "attributeId là bắt buộc",
            "string.empty": "attributeId không được để trống"
          }),
        valueId: Joi.string()
          .length(24)
          .hex()
          .required()
          .messages({
            "string.length": "valueId phải có đúng 24 ký tự",
            "string.hex": "valueId không hợp lệ",
            "any.required": "valueId là bắt buộc",
            "string.empty": "valueId không được để trống"
          })
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "attributes phải là một mảng",
      "array.min": "Phải có ít nhất một cặp thuộc tính - giá trị",
      "any.required": "attributes là bắt buộc"
    }),

  price: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Giá phải là số",
      "number.min": "Giá không được nhỏ hơn 0",
      "any.required": "Giá là bắt buộc"
    }),

  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.base": "Số lượng phải là số",
      "number.integer": "Số lượng phải là số nguyên",
      "number.min": "Số lượng không được nhỏ hơn 0",
      "any.required": "Số lượng là bắt buộc"
    }),

    image: Joi.string()
    .uri()
    .required()
    .messages({
       "string.empty": "Image không được để trống",
       "string.uri": "Image phải là một URL hợp lệ",
       "any.required": "Image là bắt buộc"
  })

});
