import type React from "react"
import type { VariantInput, VariantErrors } from "../../../types/Product"

export const validateVariantField = (
  variants: VariantInput[],
  index: number,
  field: keyof VariantInput,
  value: any,
  setVariantErrors: React.Dispatch<React.SetStateAction<VariantErrors[]>>
) => {
  setVariantErrors((prev) => {
    const updated = [...prev]
    updated[index] = { ...updated[index] }

    switch (field) {
      case "price":
        const priceNum = Number.parseFloat(value)
        if (!value || isNaN(priceNum) || priceNum <= 0) {
          updated[index].price = "Giá phải là số lớn hơn 0"
        } else {
          delete updated[index].price
        }
        break

      case "stock":
        const stockNum = Number.parseInt(value)
        if (!value || isNaN(stockNum) || stockNum < 0) {
          updated[index].stock = "Số lượng phải là số không âm"
        } else {
          delete updated[index].stock
        }
        break

      case "image":
        const isNewVariant = !variants[index]?._id
        if (isNewVariant && !value) {
          updated[index].image = "Ảnh là bắt buộc"
        } else {
          delete updated[index].image
        }
        break
    }

    return updated
  })
}

export const validateAllVariants = (
  variants: VariantInput[],
  setVariantErrors: React.Dispatch<React.SetStateAction<VariantErrors[]>>
): boolean => {
  let isValid = true

  const newErrors: VariantErrors[] = variants.map(() => ({}))

  variants.forEach((variant, index) => {
    const errors: VariantErrors = {}

    const priceNum = Number.parseFloat(variant.price)
    if (!variant.price || isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Giá phải là số lớn hơn 0"
      isValid = false
    }

    const stockNum = Number.parseInt(variant.stock)
    if (!variant.stock || isNaN(stockNum) || stockNum < 0) {
      errors.stock = "Số lượng phải là số không âm"
      isValid = false
    }

    const isNewVariant = !variant._id
    const hasNewImage = !!variant.image

    if (isNewVariant && !hasNewImage) {
      errors.image = "Ảnh là bắt buộc"
      isValid = false
    }

    newErrors[index] = errors
  })

  setVariantErrors(newErrors)
  return isValid
}
