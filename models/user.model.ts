import {model, Schema} from 'mongoose'
import paginate from "mongoose-paginate-v2";

let schema = new Schema({
    first_name: String,
    last_name: String,
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: String,
    phone: String,
    active: Boolean,
    admin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'role',
    }
}, {timestamps: true})
schema.plugin(paginate)
const User = model('user', schema)
export default User