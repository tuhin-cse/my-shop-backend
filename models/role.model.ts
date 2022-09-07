import {model, Schema} from 'mongoose'

let schema = new Schema({
        name: {
            type: String,
            unique: true,
        },
        deletable: {
            type: Boolean,
            default: true
        },
        permissions: [String],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        }
    }, {timestamps: true}
)
const Role = model('role', schema)
export default Role