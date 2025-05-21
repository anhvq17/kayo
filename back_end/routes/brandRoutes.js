import { Router } from "express";
import { createBrand, deleteBrand, getAllBrands, getBrandDetail, updateBrand } from "../controllers/brandController";

const brandRouter = Router()

brandRouter.get('/',getAllBrands)
brandRouter.get('/:id',getBrandDetail)
brandRouter.post('/',createBrand)
brandRouter.put('/:id',updateBrand)
brandRouter.delete('/:id',deleteBrand)

export default brandRouter