import {Router} from 'express'
import userRoutes from "./api/user.routes";
import roleRoutes from "./api/role.routes";
import settingsRoutes from "./api/settings.routes";
import categoryRoutes from "./api/category.routes";
import productsRoutes from "./api/product.routes";

const apiRoutes = Router()

apiRoutes.use('/category', categoryRoutes)
apiRoutes.use('/product', productsRoutes)
apiRoutes.use('/user', userRoutes)
apiRoutes.use('/role', roleRoutes)
apiRoutes.use('/settings', settingsRoutes)

apiRoutes.use(function(err, req, res, next) {
    try {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
});

export default apiRoutes