import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protect, admin } from '../middleware/auth.js';

const settingRouter = express.Router();

settingRouter.get('/admin/settings', protect, admin, getSettings);
settingRouter.post('/admin/settings', protect, admin, updateSettings);

export default settingRouter;