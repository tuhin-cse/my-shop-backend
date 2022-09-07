import {connection, model, Schema} from 'mongoose'
import paginate from "mongoose-paginate-v2";

const autoIncrement = require('mongoose-auto-increment')
autoIncrement.initialize(connection);

let schema = new Schema({
        ref: {
            type: Number,
            unique: true
        },
        beneficiary: {
            type: Schema.Types.ObjectId,
            ref: 'beneficiary',
            required: true
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'project',
            required: true
        },
        card: {
            type: Schema.Types.ObjectId,
            ref: 'card',
            required: true,
        },
        project_card: {
            type: Schema.Types.ObjectId,
            ref: 'project_card',
            required: true,
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'shop',
            required: true
        },
        round: {
            type: Schema.Types.ObjectId,
            ref: 'project_round',
            required: true,
        },
        items: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'project_product',
            },
            name: String,
            price: Number,
            fee_rate: Number,
            fee: Number,
            total_fee: Number,
            quantity: Number,
            subtotal: Number
        }],
        fee: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        },
        note: String,
    }, {timestamps: true}
)
schema.plugin(autoIncrement.plugin, {
    model: 'order',
    field: 'ref',
    startAt: 1,
    incrementBy: 1
});
schema.plugin(paginate)
schema.path('ref').get(v => `ORDER-${v?.toString()?.padStart(3, '0')}`);
const Order = model('order', schema)
export default Order