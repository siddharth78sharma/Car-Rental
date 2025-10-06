import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
      const token = req.headers.authorization;
      if(!token){
        return res.json({success: false, message: "not authorized"})
      }
      try {
          const userId = jwt.decode(token, process.env.JWT_SECRET)
           
          if(!userId){
            return res.json({success: false, message: "not authorized"})
          }
          req.user = await User.findById(userId).select("-password")
          next();
      } catch (error) {
           return res.json({success: false, message: "not authorized"})
      }
} 

export const admin = (req, res, next) => {
    // Check if the user object exists on the request and if their role is 'admin'
    if (req.user && req.user.role === 'admin') {
        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // If the user is not an admin, send a 403 Forbidden error
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
