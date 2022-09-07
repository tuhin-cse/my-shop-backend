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
    birthday: String,
    id_number: String,
    id_type: String,
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'role',
    }],
    country: String,
    city: String,
    area: String,
    street: String,
    building: String,
    door: String,
    address: String,
    image: String,
    id: String,
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, {timestamps: true})
schema.plugin(paginate)
const User = model('user', schema)
export default User