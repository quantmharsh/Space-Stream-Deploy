import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2  as cloudinary} from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const signupUser=  async(req ,res)=>{
    // res.send("signed up succesfully")
    try {
        // 1. get data from body
        const{name  , email , username , password}=req.body;
        //2 .check whether user  alreadyexists or not
        const user= await User.findOne({$or :[{email} ,{username}]})
        if(user)
        {
            return res.status(400).json({message:"user already exists.."})

        }
        //  3. if user does not exists. encrypt its passowrd using bcrypt and salt
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password ,salt);
        //  4 .create newuser object
        const newUser= new User({
            name ,
            email,
            username,
            password:hashedPassword
        });
        //  5. save new user in db
        
        await newUser.save();
        // 6.  return new user data as a response
        if(newUser)
        {
            generateTokenAndSetCookie(newUser._id , res);
            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                 email:newUser.email,
                 username:newUser.username,
                 bio:newUser.bio,
                 profilePic:newUser.profilePic

            })
        }
        else{
            res.status(400).json({
                message:"Invalid user data"
            })
        }
        
        
    } catch (error) {
        res.status(500).json({ message:error.message})
        console.log("Error while signup");
        
    }
}

const loginUser= async(req ,res)=>{
    try {
        const{username  , password}=req.body;
        const user= await User.findOne({username});
        if(!user)
        {
            return  res.status(400).json({message:
                "Invalid Username or Password"});
        }
        const  isPasswordCorrect= await bcrypt.compare(password , user.password);
        if(!user || !isPasswordCorrect)
        {
            return  res.status(400).json({message:
            "Invalid Username or Password 2"});
        }
        // if user has previously made his account freeze . we will unfreeze it if he logins again
        if(user.isFrozen)
        {
            user.isFrozen=false;
            await user.save();
        }
        // generating tokens when user logs in
        generateTokenAndSetCookie(user._id  ,res);
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            username:user.username,
            bio:user.bio,
            profilePic:user.profilePic
        });

        
    } catch (error) {
        res.status(500).json({message:error.message})
         console.log("error while creating user" ,error
         )
    }
}
const logoutUser=async(req , res)=>{
   try {
    // clearing cookie to log out user
    res.cookie("jwt" ,"",{
        maxage:1
    })
    return res.status(201).json({message:"user logged out successfully"});
    
   } catch (error) {
    res.status(500).json({message:error.message})
         console.log("error while log out user" ,error)
    
   }

}
const followUnfollowUser =async(req,res)=>{
 try {
    const {id}=req.params;
    const userToModify= await User.findById(id);
    // this _id we are getting from middleware protectedroute
    const currentUser= await User.findById(req.user._id);
    if(id===req.user._id.toString())
    {
        return res.status(401).json({message:"you cant follow or unfollow yourself"});
    }
    if(!userToModify || !currentUser)
    {
        return res.status(401).json({message:"No user found"});
    }
    //check whether are we already following that particular user
    const isFollowing= currentUser.following.includes(id);
    // if we are already following then  we will unfollow  else follow
    //for this we have to make two changes 1. in following list of current user and 2. followers list of  usertomodify

    if(isFollowing)
    {
        
        // remove from current user following list
        await User.findByIdAndUpdate(req.user._id , { $pull : { following:id}});
        
        // remove followers from  usertomodify
        await User.findByIdAndUpdate(id , {$pull: {followers:req.user._id}});
        res.status(200).json({message:"user unfollowed successfully"})

    }
    else{
        await User.findByIdAndUpdate(req.user._id ,{ $push :{following:id}})

        await User.findByIdAndUpdate(id , { $push :{ followers:req.user._id }});

         res.status(200).json({message:"user followed successfully"})


    }
    
 } catch (error) {
    res.status(500).json({error:error.message})
    console.log("error while follow unfolow" ,error)
    
 }
}
const updateUser=async(req ,res)=>{
    const{name , email , username , bio , password} = req.body;
    const userId=req.user._id;
    console.log("userid in usercontroller",userId)
    let {profilePic }= req.body;
   
    try {
       
        // here also getting userId from req.user._id where we are getting this from middleware protectRoute 
        let user= await User.findById(userId);
        console.log("user data in usercontroller ", user);
        
        if(!user)
        {
            return res.status(401).json({message:"user not found"});
        }
       
        // if condition to check that only same logged in user can update its profile
        if(req.params.id !== userId.toString())
        {
            return res.status(404).json({message:" You cannot update other users profile"})
        }
        //update password
        if(password)
        {
            const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password ,salt);
        // update user password
        user.password=hashedPassword;
        }
        // update profile pic using cloudinary
        if(profilePic)
        {
            // delete previous file on cloudinary
            if(user.profilePic)
            {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }
            const uploadResponse=await cloudinary.uploader.upload(profilePic);
            profilePic=uploadResponse.secure_url;
        }
        user.name= name ||user.name;
        user.email=email ||user.email;
        user.username= username ||user.username;
        user.bio= bio||user.bio;
        user.profilePic= profilePic||user.profilePic;
       user=  await user.save();
       // Find all posts that this user replied and update username and userProfilePic fields
       await Post.updateMany(
        { 
            "replies.userId":userId
        },
        {
            $set:{
                "replies.$[reply].username":user.username,
                "replies.$[reply].userProfilePic":user.profilePic
            }
        },
        {arrayFilters:[{"reply.userId":userId}]}
        )
    //    we are doing this because we dont want to send password as a response  in  frontend

       user.password=null;
       res.status(200).json(user)




        
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log("error while  updating the user" ,error)
        
    }
}
const getUserProfile=async(req,res)=>{
    try {
        // fetching user details using  username or  userId .thats why using query
        const {query}= req.params;
        let user;
        if(mongoose.Types.ObjectId.isValid(query))
        {
           user = await User.findOne({_id:query}).select("-password").select("-updatedaAt");
        }
        else{
           user= await User.findOne({username:query}).select("-password").select("-updatedAt");
        }
       
        
        if(!user)
        {
            return res.status(401).json({error:"user profile  not found "});
        }
         res.status(202).json(user);
        
        
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log("error while   getting profile" ,error)
        
        
    }

}
const getSuggestedUsers = async(req , res)=>{
    try {
        const userId= req.user._id;
        const usersFollowedByYou =await  User.findById(userId).select("following");
        //  exclude logged in user and get 10 users from db using aggregation pipeline
        const users= await User.aggregate([
            {
               $match:{
                _id:{ $ne:userId} ,
               },
            },
            {
                $sample:{
                    size:10
                }
            }
        ])
        //select users whom which we are not following 
        const filteredUsers=  users.filter((user) => !usersFollowedByYou.following.includes(user._id));
        console.log("filtterdusers" , filteredUsers);
        const suggestedUsers=filteredUsers.slice(0 ,4);
        // make password field null 
        suggestedUsers.forEach((user) => (user.password=null))
        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
// step 4 create function in backend ( next step in settingpage.jsx)
const freezeAccount=async(req , res)=>{
    try {
      const user= await User.findById(req.user._id)
      if(!user)
      {
        return res.status(404).json({error:"user not found"})
      }
      user.isFrozen=true;
      await user.save();
      res.status(200).json({success:true});

    } catch (error) {
        res.status(501).json({error:error.message})
        
    }
}
export {signupUser , loginUser  ,logoutUser , followUnfollowUser , updateUser  ,getUserProfile , getSuggestedUsers  , freezeAccount} 