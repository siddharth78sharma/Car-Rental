import express from "express";
import { protect } from "../middleware/auth.js";
import { addItem, changeRoleToOwner, deleteItem, getDashboardData, getItemById, getItemDetails, getOwnerItems, getVendorServices, toggleItemAvailability, updateItem, updateUserImage, updateVendorProfile } from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-item", upload.single("image"), protect, addItem);
ownerRouter.get("/items", protect, getOwnerItems);
ownerRouter.get("/item/:itemId", protect, getItemById);
//ownerRouter.post("/update-item", protect, updateItem);
ownerRouter.put("/item/:itemId", protect, updateItem);
ownerRouter.post("/toggle-item", protect, toggleItemAvailability);
ownerRouter.post("/delete-item", protect, deleteItem);

ownerRouter.put('/update-profile-details', protect, updateVendorProfile); 


ownerRouter.get('/dashboard', protect, getDashboardData);
ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage);
ownerRouter.get('/details/:id',protect, getItemDetails);
ownerRouter.get("/vendor/:id", getVendorServices);

export default ownerRouter;




// import express from "express";
// import { protect } from "../middleware/auth.js";
// import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controllers/ownerController.js";
// import upload from "../middleware/multer.js";

// const ownerRouter = express.Router();

// ownerRouter.post("/change-role", protect, changeRoleToOwner)
// ownerRouter.post("/add-car", upload.single("image"), protect, addCar)
// ownerRouter.get("/cars", protect, getOwnerCars)
// ownerRouter.post("/toggle-car", protect, toggleCarAvailability)
// ownerRouter.post("/delete-car", protect, deleteCar)

// ownerRouter.get('/dashboard', protect, getDashboardData)
// ownerRouter.post('/update-image', upload.single("image"), protect, updateUserImage)

// export default ownerRouter;