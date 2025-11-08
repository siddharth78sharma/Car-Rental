import express from 'express';
import { getMapItems, updateItemCoords } from '../controllers/mapController.js';
import { protect, admin } from '../middleware/auth.js'; // protect update endpoints

const mapRouter = express.Router();
mapRouter.get('/items', getMapItems);

// Protect update endpoint so only owner/admin can update item coords
mapRouter.put('/item/:itemId/coords', protect, updateItemCoords);

export default mapRouter;

