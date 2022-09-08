import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import {havePermission} from "../auth";
import Settings from "../models/settings.model";
import axios from "axios";

const secret = process.env.SECRET

export const userRegistration = async (req, res) => {
    try {
        let {body} = req
        let user = new User({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email.toLowerCase(),
            password: bcrypt.hashSync(body.password, 8),
        })
        await user.save()
        let token = jwt.sign({_id: user._id, role: user.role}, secret, {expiresIn: '8h'})
        return res.status(200).send({
            error: false,
            msg: 'Successfully registered',
            token,
        })
    } catch (e) {
        if (e?.code === 11000) {
            return res.status(406).send({
                error: true,
                msg: 'An account with this email already exists',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const userLogin = async (req, res) => {
    try {
        let {body} = req
        if (body.email) {
            const user = await User.findOne().or([{email: body.email.toLowerCase()}, {username: body.email}])
            if (user) {
                let auth = await bcrypt.compare(body.password, user.password)
                if (auth) {
                    let token = jwt.sign({_id: user._id}, secret, {expiresIn: '8h'})
                    return res.status(200).send({
                        error: false,
                        msg: 'Login successful',
                        token,
                    })
                } else {
                    return res.status(401).send({
                        error: true,
                        msg: 'Invalid password'
                    })
                }
            }
        }
        return res.status(404).json({
            error: true,
            msg: 'User not found'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const userVerify = async (req, res) => {
    if (res.locals?.user?._id) {
        let user = await User.findById(res.locals?.user?._id, ['first_name', 'last_name', 'role', 'admin']).populate('role', ['name', 'permissions'])
        if (user) {
            return res.status(200).send({
                error: false,
                msg: 'Successfully verified',
                data: user,
            })
        }
    }
    res.status(404).json({
        error: true,
        msg: 'User not found'
    })
}

export const userProfile = async (req, res) => {
    try {
        if (res.locals?.user?._id) {
            let user = await User.findById(res.locals?.user?._id, ['first_name', 'last_name', 'email', 'phone', 'address', 'image']).populate('roles', 'name')
            if (user) {
                return res.status(200).send({
                    error: false,
                    msg: 'Successfully gets profile',
                    data: user,
                })
            }
        }
        res.status(404).json({
            error: true,
            msg: 'User not found'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {body} = req
        if (res.locals?.user?._id) {
            await User.findByIdAndUpdate(res.locals?.user?._id, {
                first_name: body.first_name,
                last_name: body.last_name,
                phone: body.phone,
                address: body.address,
                image: body.image,
            })
            return res.status(200).send({
                error: false,
                msg: 'Profile successfully updated',
            })
        }
        res.status(404).json({
            error: true,
            msg: 'User not found'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const changePassword = async (req, res) => {
    try {
        let {body} = req
        if (res.locals?.user?._id) {
            const user = await User.findById(res.locals?.user?._id, 'password')
            if (user) {
                let auth = await bcrypt.compare(body.current_password, user.password)
                if (auth) {
                    user.password = bcrypt.hashSync(body.password, 8)
                    await user.save()
                    return res.status(200).json({
                        error: false,
                        msg: 'Password updated successfully'
                    })
                } else {
                    return res.status(404).json({
                        error: true,
                        msg: 'Current password is not valid'
                    })
                }
            }
        }
        return res.status(404).json({
            error: true,
            msg: 'User not found.'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed! Try Again'
        })
    }
}


export const forgetPassword = async (req, res) => {
    try {
        let {body} = req
        if (body.email) {
            let user = await User.findOne({email: body.email.toLowerCase()})
            if (user) {
                let token = jwt.sign({_id: user._id, action: 'resetPassword'}, secret, {expiresIn: '1h'})
                sendMail(user?.email, 'Reset Your Password', 'Reset Your Password', `
                <h3>Hello, ${user.first_name} ${user.last_name}</h3>
                <p>You are receiving this email because we received a password reset request for your account. <br> <br>
                click  <a href="${process.env.FRONTEND_URL + 'reset?ref=' + token}">Here</a> to Reset Password. <br>
                If you did not request a password reset, no further action is required.
                <p>Thanks a lot for being with us <br/> <hr>
                </p>
                `)

                return res.status(200).json({
                    error: false,
                    msg: 'Check email for password rest link.'
                })
            }
        }
        return res.status(404).json({
            error: true,
            msg: 'User not found'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const updatePassword = async (req, res) => {
    try {
        let {body} = req
        let data = jwt.verify(body.ref, secret)
        if (data.action === 'resetPassword' && body.password) {
            await User.findByIdAndUpdate(data._id, {password: bcrypt.hashSync(body.password, 8)})
            return res.status(200).json({
                error: false,
                msg: 'Successfully resets password'
            })
        }
        return res.status(404).json({
            error: true,
            msg: 'Password update failed'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Link Expired! Try Again'
        })
    }
}


export const getUsers = async (req, res) => {
    try {
        const {query} = req
        const {user} = res.locals
        let admin = havePermission('site_admin', user?.roles)
        let filter = {}
        if (admin) {
            filter['parent'] = {$exists: false}
        } else {
            filter['parent'] = user.parent || user._id
        }
        if (!!query.search) {
            filter["$or"] = [
                {first_name: {$regex: new RegExp(query.search.toLowerCase(), "i")}},
                {last_name: {$regex: new RegExp(query.search.toLowerCase(), "i")}},
                {email: {$regex: new RegExp(query.search.toLowerCase(), "i")}},
                {phone: {$regex: new RegExp(query.search.toLowerCase(), "i")}}
            ]
        }

        // @ts-ignore
        let data = await User.paginate(filter, {
            select: ['first_name', 'last_name', 'roles', 'email', 'phone', 'active', 'image'],
            populate: {path: 'roles', select: 'name'},
            page: query.page || 1,
            limit: query.size || 10,
            sort: {createdAt: -1},
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets users',
            data: data,
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const getUser = async (req, res) => {
    try {
        const {query} = req
        let data = await User.findById(query._id).populate('roles', 'name')
        return res.status(200).send({
            error: false,
            msg: 'Successfully get user',
            data: {
                ...data._doc,
                password: undefined
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const postUser = async (req, res) => {
    try {
        let {body} = req
        const {user} = res.locals
        let admin = havePermission('site_admin', user?.roles)
        if (admin) {
            delete body.parent
        } else {
            body.parent = user.parent || user._id
        }
        if (!!body._id) {
            if (!!body.password) {
                body.password = bcrypt.hashSync(body.password, 8)
            } else {
                delete body.password
            }
            if (!!body.email) {
                body.email = body.email.toLowerCase()
            }
            await User.findOneAndUpdate({_id: body._id}, {...body, admin: false})
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated user'
            })
        } else {
            delete body._id
            await User.create({
                ...body,
                email: body.email.toLowerCase(),
                password: bcrypt.hashSync(body.password, 8),
                admin: false
            })
            return res.status(200).send({
                error: false,
                msg: 'Successfully added user'
            })
        }
    } catch (e) {
        if (e?.code === 11000) {
            return res.status(406).send({
                error: true,
                msg: e.keyPattern?.email === 1 ? 'Email Already Exists' : 'Username already exists',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const {query} = req
        const {user} = res.locals
        let admin = havePermission('site_admin', user?.roles)
        if (!admin) {
            let d = await User.findById(query._id, 'parent')
            if (user?._id.toString() !== d?.parent?.toString()) {
                return res.status(401).send({
                    error: true,
                    msg: 'Unauthorized action'
                })
            }
        }
        await User.findByIdAndDelete(query._id)
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted user',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const getDashboard = async (req, res) => {
    try {
        const {query} = req
        const {user: d} = res.locals
        // if (!!d) {
        //     let user = await User.findById(d?._id, 'roles parent').populate('roles', 'permissions')
        //     if (!!user) {
        //         const admin = havePermission('site_admin', user?.roles)
        //         let overview
        //         let companies_overview
        //         let total_sale
        //         let total_purchase
        //         if (admin) {
        //             overview = {
        //                 products: await Product.count(),
        //                 customer: 0,
        //                 total: await Order.count(),
        //                 today: await Order.count({createdAt: {$gte: moment(query.date).toDate()}}),
        //             }
        //             let sales = await Order.aggregate([
        //                 {$group: {_id: null, total: {$sum: '$total'}}}
        //             ])
        //             total_sale = sales?.length > 0 ? sales[0].total : 0
        //             let purchases = await Purchase.aggregate([
        //                 {$group: {_id: null, total: {$sum: {$multiply: ["$price", "$quantity"]}}}}
        //             ])
        //             total_purchase = purchases?.length > 0 ? purchases[0].total : 0
        //             companies_overview = {
        //                 companies: await Company.count(),
        //                 projects: await Project.count(),
        //                 cards: await Card.count(),
        //                 beneficiaries: await Beneficiary.count()
        //             }
        //         } else {
        //             const shopPermission = havePermission('shop_show', user?.roles)
        //             let shops = await Shop.find({user: user?.parent || user._id}, '_id')
        //             let shop = {$in: shops?.map(d => d._id)}
        //             if (shopPermission) {
        //                 overview = {
        //                     products: await ShopProduct.count({shop}),
        //                     customer: 0,
        //                     total: await Order.count({shop}),
        //                     today: await Order.count({shop, createdAt: {$gte: moment(query.date).toDate()}}),
        //                 }
        //                 let sales = await Order.aggregate([
        //                     {$match: {shop}},
        //                     {$group: {_id: null, total: {$sum: '$total'}}}
        //                 ])
        //                 total_sale = sales?.length > 0 ? sales[0].total : 0
        //                 let purchases = await Purchase.aggregate([
        //                     {$match: {shop}},
        //                     {$group: {_id: null, total: {$sum: {$multiply: ["$price", "$quantity"]}}}}
        //                 ])
        //                 total_purchase = purchases?.length > 0 ? purchases[0].total : 0
        //             }
        //             const projectPermission = havePermission('project_show', user?.roles)
        //             if (projectPermission) {
        //                 let companies = await Company.find({manager: user?.parent || user._id, active: true}, '_id')
        //                 let company = {$in: companies?.map(d => d._id)}
        //                 let projects = await Project.find({company}, '_id')
        //                 let project = {$in: projects?.map(d => d._id)}
        //                 let cards = await ProjectCard.aggregate([
        //                     {$match: {project}},
        //                     {$group: {_id: '$card'}}
        //                 ])
        //                 companies_overview = {
        //                     companies: companies.length,
        //                     projects: await projects.length,
        //                     cards: cards.length,
        //                     beneficiaries: await Beneficiary.count({company})
        //                 }
        //             }
        //         }
        //         return res.status(200).send({
        //             error: false,
        //             msg: 'Successfully gets dashboard',
        //             data: {
        //                 overview,
        //                 total_sale,
        //                 total_purchase,
        //                 companies_overview,
        //             }
        //         })
        //     }
        // }
        return res.status(401).send({
            error: true,
            msg: 'Unauthorized'
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const sendWhatsappMessage = async (to, message, type) => {
    try {
        let settings = await Settings.findOne({}, 'whatsapp')
        let response = await axios.post(`${settings?.whatsapp?.endpoint}/v1/messages`, {
            "to": to.substring(0, 3) === '009' ? '+9' + to.substring(3) : to,
            "type": "template",
            "template": {
                "namespace": settings?.whatsapp[`${type}_template`],
                "name": "verification_cardcode",
                "language": {
                    "policy": "deterministic",
                    "code": "en_US"
                },
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": message
                            }
                        ]
                    }
                ]
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings?.whatsapp?.token}`,
            }
        })
        return {
            error: false,
            msg: 'Successfully Send'
        }
    } catch (e) {
        console.log(e.message)
        return {
            error: true,
            msg: 'Send failed.'
        }
    }
}

export const sendMail = async (to, subject, text = '', html = '') => {
    try {
        const sgMail = require('@sendgrid/mail')
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: to, // Change to your recipient
            from: process.env.SENDGRID_SENDER, // Change to your verified sender
            subject: subject,
            text: text,
            html: html,
        }
        await sgMail.send(msg)
    } catch (e) {

    }
}