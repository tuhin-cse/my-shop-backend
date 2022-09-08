import jwt from 'jsonwebtoken'
import User from "../models/user.model";

const secret = process.env.SECRET

const decodeToken = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1]
        res.locals.user = jwt.verify(token, secret)
        next()
    } catch (err) {
        next()
    }
}
export default decodeToken

export const userAuth = (permission, update = '') => async (req, res, next) => {
    try {
        const {body} = req
        const token = req.headers?.authorization?.split(" ")[1]
        let decode = jwt.verify(token, secret)
        let user = await User.findById(decode._id, [ 'admin', 'role', 'parent']).populate('role', ['permissions'])
        if(user.admin === true) {
            next()
            return
        }
        res.locals.user = user
        if (!!body._id && !!update) {
            if (havePermission(update, user.role)) {
                next()
                return
            }
        } else {
            if (havePermission(permission, user.role)) {
                next()
                return
            }
        }
        return res.status(401).send({
            error: true,
            msg: "You don't have permission for this job"
        })
    } catch (err) {
        console.log(err)
        return res.status(401).send({
            error: true,
            msg: 'Session Expired. Please Login again'
        })
    }
}

export const havePermission = (permission, role) => {
    if (role?.permissions?.includes(permission)) {
        return true
    }
}