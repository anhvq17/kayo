
export interface AttributeValue {
    _id: string
    value: string
    attributeId: {
        _id: string
        name: string
    }
}

export interface GroupedAttribute {
    attributeId: string
    name: string
    values: AttributeValue[]
}

export interface VariantInput {
    _id?:string
    attributes: { attributeId: string; valueId: string }[]
    price: string
    stock: string
    image: File | null
    imagePreview?: string
}

export interface VariantErrors {
    price?: string
    stock?: string
    sku?: string
    image?: string
}

export interface ProductInput {
    name: string
    description: string
    priceDefault: string
    categoryId: string
    brandId: string
    image: FileList
}