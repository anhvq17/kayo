import { Router } from "express";
import { createVariant, deleteVariant, getAllVariant, getVariantDetail, getVariantsByProductId, updateVariant } from "../controllers/productVariantController";

const productVariantRouter = Router();

productVariantRouter.get('/',getAllVariant)
productVariantRouter.get('/product/:productId', getVariantsByProductId); // gọi ra tất cả biến thể
productVariantRouter.get('/:id',getVariantDetail)
productVariantRouter.post('/',createVariant)
productVariantRouter.put('/:id',updateVariant)
productVariantRouter.delete('/:id',deleteVariant)


export default productVariantRouter;
