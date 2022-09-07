import {Router} from "express";
import {
    deleteRole,
    getPermissions,
    getRole,
    getRoles,
    postPermissions,
    postRole
} from "../../controllers/role.controller";
import {userAuth} from "../../auth";

const roleRoutes = Router()

roleRoutes.get('/list', userAuth('role_show'), getRoles)
roleRoutes.get('/', userAuth('role_show'), getRole)
roleRoutes.post('/', userAuth('role_create', 'role_edit'), postRole)
roleRoutes.delete('/', userAuth('role_delete'), deleteRole )

roleRoutes.get('/permissions', userAuth('role_show'), getPermissions)
roleRoutes.post('/permissions', userAuth('role_edit'), postPermissions)


export default roleRoutes