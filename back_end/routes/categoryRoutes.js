import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryDetail, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = Router()

categoryRouter.get('/',getAllCategories)
categoryRouter.get('/:id',getCategoryDetail)
categoryRouter.post('/',createCategory)
categoryRouter.patch('/:id',updateCategory)
categoryRouter.delete('/:id',deleteCategory)

export default categoryRouter