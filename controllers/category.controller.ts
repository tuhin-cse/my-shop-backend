import Category from "../models/category.model";

export const getCategories = async (req, res) => {
    const {query} = req
    let filter: any = {}
    if (query.search) {
        filter['name'] = {$regex: new RegExp(query.search.toLowerCase(), "i")}
    }
    let data = await Category.find(filter)
    return res.status(200).send({
        error: false,
        msg: 'Successfully get categories',
        data
    })
}

export const getCategory = async (req, res) => {
    const {query} = req
    let data = await Category.findById(query._id)
    return res.status(200).send({
        error: false,
        msg: 'Successfully get category',
        data
    })
}

export const postCategory = async (req, res) => {
    try {
        let {body} = req
        if (!!body._id) {
            await Category.findOneAndUpdate({_id: body._id}, body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated category'
            })
        } else {
            delete body._id
            await Category.create(body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully added category'
            })
        }
    } catch (e) {
        if (e?.code === 11000) {
            return res.status(406).send({
                error: true,
                msg: 'Category name already exists',
            })
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const delCategory = async (req, res) => {
    const {query} = req
    await Category.findByIdAndDelete(query._id)
    return res.status(200).send({
        error: false,
        msg: 'Successfully deleted category',
    })
}