import {Router} from "express";
import {userAuth} from "../../auth";
import {getSettings, getSiteSettings, setupSite, updateSettings} from "../../controllers/settings.controller";

const settingsRoutes = Router()

settingsRoutes.get('/', userAuth('settings'), getSettings)
settingsRoutes.get('/site', getSiteSettings)
settingsRoutes.post('/', userAuth('settings'), updateSettings)

settingsRoutes.post('/setup', setupSite)

export default settingsRoutes