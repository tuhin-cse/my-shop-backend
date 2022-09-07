import permissions from "../utils/roles";
import Role from "../models/role.model";
import {havePermission} from "../auth";

export const getPermissions = async (req, res) => {
    res.status(200).send({
        error: false,
        msg: 'Successfully gets permissions',
        data: permissions
    })
}


export const postPermissions = async (req, res) => {
    try {
        const {body} = req
        const {user} = res.locals
        let admin = havePermission('site_admin', user?.roles)
        if (!admin) {
            for (let p of body.permissions) {
                if (!havePermission(p, user?.roles)) {
                    return res.status(401).send({
                        error: true,
                        msg: 'Unauthorized permissions found'
                    })
                }
            }
        }
        await Role.findByIdAndUpdate(body.role, {permissions: body.permissions})
        res.status(200).send({
            error: false,
            msg: 'Successfully updated permissions',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }

}


export const getRoles = async (req, res) => {
    try {
        const {user} = res.locals
        let admin = havePermission('site_admin', user?.roles)
        let filter = {}
        if (admin) {
            filter['user'] = {$exists: false}
        } else {
            filter['user'] = user?.parent || user._id
        }
        let roles = await Role.find(filter, ['name', 'deletable'],)
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets roles',
            data: roles,
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const getRole = async (req, res) => {
    try {
        const {query} = req
        let select = query?.permissions ? ['name', 'permissions'] : ['name']
        let data = await Role.findById(query._id, select)
        return res.status(200).send({
            error: false,
            msg: 'Successfully get role',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const postRole = async (req, res) => {
    try {
        let {body} = req
        const {user} = res.locals
        let admin = havePermission('site_admin', user?.roles)
        let data = {name: body.name}
        if(!admin) {
            data["user"] = user?.parent || user._id
        }
        if (!!body._id) {
            await Role.findOneAndUpdate({_id: body._id}, data)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated role'
            })
        } else {
            await Role.create(data)
            return res.status(200).send({
                error: false,
                msg: 'Successfully added role'
            })
        }
    } catch (e) {
        if (e?.code === 11000) {
            return res.status(406).send({
                error: true,
                msg: 'Role name already exists',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const deleteRole = async (req, res) => {
    try {
        const {query} = req
        const {user} = res.locals
        let role = await Role.findById(query._id)
        if(role.user.toString() === user._id.toString() || role.user.toString() === user.parent.toString()) {
            await Role.findByIdAndDelete(query._id)
            return res.status(200).send({
                error: false,
                msg: 'Successfully deleted role',
            })
        }
        return res.status(401).send({
            error: true,
            msg: 'Unauthorized action'
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

