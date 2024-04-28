import User from "../models/userModel.js";
import  jwt from "jsonwebtoken";
const protectRoute =async(req  ,res, next)=>{
    try {
        const token =req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({message:"Unauthorized"})
        }
        // decode the jwt token to find the  userid of the logged in user 
        const decoded= jwt.verify(token , process.env.JWT_SECRET);
        //getting all data of the user logged in and except password;
        const user= await User.findById(decoded.userId).select("-password");
        // in  req object user we are addding this user data which we will use further
        req.user= user;
        next();



        
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log("error   in protectedRoute" ,error)
        
    }
}
export default protectRoute