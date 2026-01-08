import express from "express";
import { getMapVendors, updateVendorCoords } from "../controllers/mapController.js";
import { protect, admin } from "../middleware/auth.js";

const mapRouter = express.Router();

// Get all vendors with coords
mapRouter.get("/vendors", getMapVendors);

// Update vendor coords (only owner or admin)
mapRouter.put("/vendor/:vendorId/coords", protect, updateVendorCoords);

export default mapRouter;


















// import express from 'express';
// import {  getMapItems, updateItemCoords } from '../controllers/mapController.js';
// import { protect, admin } from '../middleware/auth.js'; // protect update endpoints

// const mapRouter = express.Router();
// mapRouter.get('/items', getMapItems);

// // Protect update endpoint so only owner/admin can update item coords
// mapRouter.put('/item/:itemId/coords', protect, updateItemCoords);

// //mapRouter.get("/fill-coords", fillMissingCoords);

// export default mapRouter;

