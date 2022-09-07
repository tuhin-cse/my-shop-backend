import {Router} from "express";
import {userAuth} from "../../auth";
import {delCategory, getCategories, getCategory, postCategory} from "../../controllers/category.controller";

const categoryRoutes = Router()
categoryRoutes.get('/list', getCategories)
categoryRoutes.get('/', userAuth('category_show'), getCategory)
categoryRoutes.post('/', userAuth('category_create', 'category_edit'), postCategory)
categoryRoutes.delete('/', userAuth('category_delete'), delCategory)

export default categoryRoutes