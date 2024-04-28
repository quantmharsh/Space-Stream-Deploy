import jwt from "jsonwebtoken"
const generateTokenAndSetCookie=async(userId ,res)=>{
    try {
        const token= jwt.sign({userId} ,process.env.JWT_SECRET ,{
            expiresIn:'5d'
        })
        res.cookie("jwt" ,token ,{
            httpOnly:true,
            maxAge:15*24*60*60*1000, //15days
            sameSite:"strict"
        });
        return token;
        
    } catch (error) {
         return res.status(500).json({message:"error while generating tokens"});
        
    }
} 
export  default generateTokenAndSetCookie