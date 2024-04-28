import mongoose from "mongoose";
const connectDB= async()=>{
    try {
      const conn=  await  mongoose.connect(process.env.MONGO_URI ,
        {
            // useNewUrlParser:true,
            // useUnifiedTopology:true,
           

        });
        console.log(`mongodb connected successfully ${conn.connection.host}`)
        
    } catch (error) {
        console.log("error occured while connecting to database" ,error)
        
    }
 }
 export default connectDB;