import {model, Schema} from 'mongoose'
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

let schema = new Schema({
        name: {
            type: String,
            unique: true,
        },
        image: String,
        code: {
            type: String,
            unique: true,
        },
        quantity: Number,
        unit: String,
        active: Boolean,
        description: String,
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'category',
        }],
        sub_categories: [{
            type: Schema.Types.ObjectId,
            ref: 'category',
        }],
        variants: [{
            name: String,
            quantity: Number,
        }]
    }, {timestamps: true}
)
schema.plugin(paginate)
schema.plugin(aggregatePaginate)
const Product = model('product', schema)
export default Product