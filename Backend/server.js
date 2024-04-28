import  express from "express";
import  dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import  userRoutes from "./routes/userRoutes.js"
import postRoutes from"./routes/postRoutes.js"
import messageRoutes from"./routes/messageRoutes.js"
import {v2 as cloudinary} from "cloudinary"
import {server , app } from "./socket/socket.js"
import  path from "path"
import exp from "constants";
dotenv.config();
connectDB();
// const app=express();

const PORT=process.env.PORT ||5000
const  __dirname= path.resolve();
// to parse  json data in req.body

app.use(express.json({limit:"50mb"})); 
// to parse form data  in req.body
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// routes
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
    
});

app.use("/api/users",userRoutes)
app.use("/api/posts" ,postRoutes)
app.use("/api/messages" ,messageRoutes)

// http://localhost:5000 => bringing bacekend and frontent under same url for deploying
if(process.env.NODE_ENV==="production")
{ 
 app.use(express.static(path.join(__dirname ,"/Frontend/dist")))
//  to render react app
 app.get("*" , (req ,res)=>{
    res.sendFile(path.resolve(__dirname, "Frontend" ,"dist" ,"index.html"))
 })
}
// app.listen(PORT , ()=>

// console.log("app listening on port.." ,PORT)
 
// )

// since we arre using socket so we need to listn on server which is http server which includes socket
server.listen(PORT , ()=>

console.log("app listening on port.." ,PORT)
)
