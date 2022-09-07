import {Router} from "express";
import {userAuth} from "../../auth";
import {
    delProduct,
    getBarcodeProducts,
    getProduct,
    getProducts,
    getStock,
    postProduct
} from "../../controllers/product.controller";

const productsRoutes = Router()
productsRoutes.get('/list', userAuth('product_show'), getProducts)
productsRoutes.get('/barcode', userAuth('barcode'), getBarcodeProducts)
productsRoutes.get('/', userAuth('product_show'), getProduct)
productsRoutes.post('/', userAuth('product_create', 'product_edit'), postProduct)
productsRoutes.delete('/', userAuth('product_delete'), delProduct)


productsRoutes.get('/stock', userAuth('product_show'), getStock)
export default productsRoutes