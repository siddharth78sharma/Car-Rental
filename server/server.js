import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import settingRouter from './routes/settingRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";
import mapRouter from "./routes/mapRoutes.js";

// Initialize Express App
const app = express()

// Connect database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)
app.use("/api/payment", paymentRoutes);
app.use('/api/maps', mapRouter);

app.use('/api', settingRouter); // Use the new settings router

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))