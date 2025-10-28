import express from "express";
import { deleteAdminItem, getAdminItems, getCars, getItems, getUserData, loginUser, registerUser, getAdminOrders, updateAdminOrderStatus, getAdminUsers, updateAdminUserRole, getAdminVendors, updateVendorStatus, getUserProfile, updateVendorProfile, listAllPublicItems, becomeVendor, getAdminDashboardStats, getAdminDashboardGraphs, getVendorProfile, forgotPassword, resetPassword } from "../controllers/userController.js";
import { admin, protect } from "../middleware/auth.js";

const  userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/items', getItems)
userRouter.get('/cars', getCars)

userRouter.get('/admin/items', protect, admin, getAdminItems);
userRouter.delete('/admin/items/:id', protect, admin, deleteAdminItem);
userRouter.get('/admin/orders', protect, admin, getAdminOrders);
userRouter.post('/admin/orders/status', protect, admin, updateAdminOrderStatus);
userRouter.get('/admin/users', protect, admin, getAdminUsers);
userRouter.post('/admin/users/role', protect, admin, updateAdminUserRole);
userRouter.get('/admin/vendors', protect, admin, getAdminVendors);
userRouter.post('/admin/vendors/status', protect, admin, updateVendorStatus);
userRouter.get('/admin/dashboard-stats', protect, admin, getAdminDashboardStats);
userRouter.get('/admin/dashboard-graphs', protect, admin, getAdminDashboardGraphs);

userRouter.get('/list-all-public', listAllPublicItems); 

userRouter.post('/become-vendor', protect, becomeVendor); 

userRouter.get('/profile', protect, getUserProfile);
//userRouter.put('/owner/update-profile', protect,  updateVendorProfile);
userRouter.get('/vendor-profile', protect, getVendorProfile);
userRouter.put('/vendor-profile', protect, updateVendorProfile);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;