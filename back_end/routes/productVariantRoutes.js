import { Router } from "express";
import { createVariant, deleteVariant, getAllVariant, getVariantDetail, updateVariant } from "../controllers/productVariantController";

const productVariantRouter = Router()

productVariantRouter.get('/',getAllVariant)
productVariantRouter.get('/:id',getVariantDetail)
productVariantRouter.post('/',createVariant)
productVariantRouter.put('/:id',updateVariant)
productVariantRouter.delete('/:id',deleteVariant)

export default productVariantRouter