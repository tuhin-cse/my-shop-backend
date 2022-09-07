import Product from "../models/product.model";

export const getProducts = async (req, res) => {
    try {
        let {query} = req
        let filter = {}
        if (!!query.category) {
            filter['categories'] = query.category
        }
        if (!!query.status) {
            filter['active'] = query.status === 'true'
        }
        if(query.search) {
            filter['name'] = {$regex: new RegExp(query.search.toLowerCase(), "i")}
        }
        // @ts-ignore
        let data = await Product.paginate(filter, {
            page: query.page || 1,
            limit: query.size || 10,
            sort: {createdAt: 1},
            populate: [
                {path: 'categories', select: ['name', '_id']},
                {path: 'sub_categories', select: ['name', '_id']}
            ]
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully get products',
            data
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const getProduct = async (req, res) => {
    try {
        const {query} = req
        let data = await Product.findById(query._id)
            .populate('categories', ['name', '_id'])
            .populate('sub_categories', ['name', '_id'])
        return res.status(200).send({
            error: false,
            msg: 'Successfully get product',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const getBarcodeProducts = async (req, res) => {
    try {
        let data = await Product.find({}, 'name code price')
        return res.status(200).send({
            error: false,
            msg: 'Successfully get product',
            data
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const postProduct = async (req, res) => {
    try {
        let {body} = req
        if (!!body._id) {
            await Product.findOneAndUpdate({_id: body._id}, body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully updated product'
            })
        } else {
            delete body._id
            await Product.create(body)
            return res.status(200).send({
                error: false,
                msg: 'Successfully added product'
            })
        }
    } catch (e) {
        if (e?.code === 11000) {
            if (e?.keyPattern?.name === 1) {
                return res.status(500).send({
                    error: true,
                    msg: 'Product name already exists'
                })
            }
            if (e?.keyPattern?.code === 1) {
                return res.status(500).send({
                    error: true,
                    msg: 'Product code already exists'
                })
            }
        }
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const delProduct = async (req, res) => {
    try {
        const {query} = req
        await Product.findByIdAndDelete(query._id)
        return res.status(200).send({
            error: false,
            msg: 'Successfully deleted product',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}


export const getStock = async (req, res) => {
    try {
        let {query} = req
        // @ts-ignore
        let data = await Product.aggregatePaginate(Product.aggregate([
            {$project: {_id: 1, name: 1, unit: 1, stock: '0', sale: '0', total: '0'}}
        ]), {
            page: query.page || 1,
            limit: query.size || 10,
        })
        return res.status(200).send({
            error: false,
            msg: 'Successfully get products',
            data
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}
