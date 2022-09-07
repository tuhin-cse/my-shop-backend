import {model, Schema} from 'mongoose'
import paginate from "mongoose-paginate-v2";

let schema = new Schema({
        message: {
            type: String,
            required: true,
        },
        data: Schema.Types.ObjectId,
        type: String,
        read: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        shop: {
            type: Schema.Types.ObjectId,
            ref: 'shop',
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'company',
        },
        expireAt: {
            type: Date,
            default: Date.now,
            index: {expireAfterSeconds: 2592000},
        },
    }, {timestamps: true}
)
schema.plugin(paginate)
const Notification = model('notification', schema)
export default Notification