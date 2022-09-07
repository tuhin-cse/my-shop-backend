import Settings from "../models/settings.model";

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne()
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets settings',
            data: settings
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const getSiteSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({}, ['site_name', 'site_footer', 'logo', 'site_phone', 'site_email', 'address'])
        return res.status(200).send({
            error: false,
            msg: 'Successfully gets settings',
            data: settings
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}

export const updateSettings = async (req, res) => {
    try {
        let {body} = req
        await Settings.findOneAndUpdate({}, body, {upsert: true})
        return res.status(200).send({
            error: false,
            msg: 'Successfully updated settings'
        })

    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: 'Server failed'
        })
    }
}