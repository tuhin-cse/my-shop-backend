import {Router} from "express";
import {userAuth} from "../../auth";
import {getSettings, getSiteSettings, updateSettings} from "../../controllers/settings.controller";

const settingsRoutes = Router()

settingsRoutes.get('/', userAuth('settings'), getSettings)
settingsRoutes.get('/site', getSiteSettings)
settingsRoutes.post('/', userAuth('settings'), updateSettings)

export default settingsRoutes