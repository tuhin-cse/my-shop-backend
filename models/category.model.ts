import {model, Schema} from 'mongoose'

let schema = new Schema({
        name: {
            type: String,
            unique: true,
        },
        image: String,
        active: Boolean,
        description: String
    }, {timestamps: true}
)
const Category = model('category', schema)
export default Category