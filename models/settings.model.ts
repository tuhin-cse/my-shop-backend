import {model, Schema} from 'mongoose'

let schema = new Schema({
        site_name: String,
        site_email: String,
        site_phone: String,
        site_footer: String,
        currency_name: String,
        currency_code: String,
        address: String,
        description: String,
        logo: String,
        whatsapp: {
            token: String,
            endpoint: String,
            otp_template: String,
            password_template: String,
        }
    }, {timestamps: true}
)
const Settings = model('settings', schema)
export default Settings