import {Router} from 'express'
import {
    changePassword, deleteUser,
    forgetPassword, getDashboard,
    getUser,
    getUsers,
    postUser,
    updatePassword, updateProfile,
    userLogin,
    userProfile,
    userRegistration,
    userVerify
} from "../../controllers/user.controller";
import {userAuth} from "../../auth";

const userRoutes = Router()

userRoutes.post('/register', userRegistration)
userRoutes.post('/login', userLogin)
userRoutes.get('/verify', userVerify)
userRoutes.get('/profile', userProfile)
userRoutes.post('/profile', updateProfile)
userRoutes.post('/password', changePassword)

userRoutes.post('/forget', forgetPassword)
userRoutes.post('/reset', updatePassword)


userRoutes.get('/list', userAuth('user_show'), getUsers)
userRoutes.get('/', userAuth('user_create'), getUser)
userRoutes.post('/', userAuth('user_edit'), postUser)
userRoutes.delete('/', userAuth('user_delete'), deleteUser)

userRoutes.get('/dashboard', getDashboard)

export default userRoutes