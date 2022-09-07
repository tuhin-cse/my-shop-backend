import {connection, model, Schema} from 'mongoose'
import paginate from "mongoose-paginate-v2";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(connection);
let schema = new Schema({
        ref: {
            type: Number,
            unique: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'company_product',
            required: true,
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'shop',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        fee_rate: {
            type: Number,
            default: 0,
        },
        total_fee: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        home_delivery: {
            type: Boolean,
            default: false
        },
        delivery_date: String,
        method: String,
        credit_charge: {
            type: Number,
            default: 0,
        },
        reject_msg: {
            type: String,
            default: '',
        },
        note: String,
        credit_status: String,
        buyer_status: {
            type: String,
            default: 'accepted'
        },
        order_status: {
            type: String,
            default: 'pending'
        },
        location: {
            country: String,
            city: String,
            area: String,
            street: String,
            building: String,
            door: String,
        }
    }, {timestamps: true}
)
schema.plugin(autoIncrement.plugin, {
    model: 'purchase',
    field: 'ref',
    startAt: 1,
    incrementBy: 1
});

schema.plugin(paginate)
schema.plugin(aggregatePaginate)
const Purchase = model('purchase', schema)
export default Purchase