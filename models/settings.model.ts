import {model, Schema} from 'mongoose'

let schema = new Schema({
        shop_name: String,
        shop_email: String,
        shop_phone: String,
        shop_footer: String,
        currency_name: String,
        currency_code: String,
        address: String,
        description: String,
        logo: String,
    }, {timestamps: true}
)
const Settings = model('settings', schema)
export default Settings