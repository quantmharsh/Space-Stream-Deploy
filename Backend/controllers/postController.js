import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2  as cloudinary} from "cloudinary";
const createPost=async(req ,res)=>{
    try {
        const{postedBy , text}=req.body;
        let{img}=req.body;
        if(!postedBy ||!text)
        {
            return res.status(401).json({message:"postedBy and text fields are required"})
        }
        // check whether user exists
        const user=await User.findById(postedBy);
        if(!user)
        {
            return res.status(401).json({message:"user not find while creating post"})
        }
        // only logged in user should be able to create a post
        // requested user -----------user coming from db
        if(req.user._id.toString()!= user._id.toString())
        {
            return res.status(401).json({message:"cant edit any another  user post"})
        }
        const maxLength=500;
        if(text.length >maxLength)
        {
            return res.status(401).json({message:"text length should be under 500"})
        }
        // using cloudinary to handle image upload
        if(img)
        {
            const uploadResponse=await cloudinary.uploader.upload(img);
            img=uploadResponse.secure_url;
        }
        const newPost= new Post({postedBy , text , img});
        await newPost.save();
        return res.status(200).json(newPost)

        }
        
    catch (error) {
        res.status(500).json({message:error.message})
        console.log("error while   getting profile" ,error)
    }

}
const getPost=async(req ,res)=>{
    try {
        const post= await Post.findById(req.params.id)
        if(!post)
        {
            res.status(500).json({message:"post not found"})
           
        }
        return res.status(201).json(post)
        
    } catch (error) {
        res.status(500).json({message:error.message})
        console.log("error while getting post" ,error)
    }
}
const deletePost=async(req ,res)=>{
  try {
    const post= await Post.findById(req.params.id);
    if(!post)
    {
        return res.status(501).json({message:"No post found"});

    }
    if(post.postedBy.toString()!==req.user._id.toString())
    {
        return res.status(401).json({message:"doesnt have rights to delete the post"})
    }
    // delete image from cloudinary also
    if(post.img)
    {
        const imgId=post.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({message:"post delted successfully"});

    
    
  } catch (error) {
    res.status(500).json({message:error.message})
    console.log("error while deleting a post" ,error)
    
  }
}
const likeUnlikePost=async(req ,res)=>{
    try {
         const{id:postId}=req.params;
         const post= await Post.findById(postId);
         const userId=req.user._id;
         if(!post)
         {
            return res.status(400).json({message:"unable to get the post"});
         }
         const userLikedPost=post.likes.includes(userId);
         if(userLikedPost)
         {
            // user already liked post then unlike it
            await Post.updateOne({_id:postId} , {$pull :{likes:userId}});
            return res.status(200).json({message:"post  unliked successfully"});

         }
         post.likes.push(req.user._id);
         await post.save();
         return res.status(200).json({message:"post  liked successfully"});

        
    } catch (error) {
        res.status(500).json({message:error.message})
    console.log("unablt to like and unlike post " ,error)
    }
}
const replyPost=async(req ,res)=>{
    try {
        const{text}=req.body;
        const postId= req.params.id;
        // getting this of current user using middleware
        const  userId=req.user._id;
        const userProfilePic= req.user.profilePic;
        const username= req.user.username;
        if(!text)
        {
            return res.status(401).json({message:"text field is required"});
        }
        // if text is present then find the post
        const post= await Post.findById(postId);
        if(!post)
        {
            return res.status(401).json({message:"post not found to reply"});
        }
        // create reply object
        const reply= {userId , text, userProfilePic , username};
        console.log("username in reply post" , username)
        post.replies.push(reply);
        await post.save();
        return res.status(201).json(reply);

        
    } catch (error) {
        res.status(500).json({message:error.message})
    console.log("error while reply to a post " ,error)
    }
}
const getFeedPost=async(req ,res)=>{
    try {
        const userId= req.user._id;
        console.log("userId in post controller get feedpost" , userId);
        const user= await User.findById(userId);
        if(!user)
        {
            console.log("no user in getfeedpost");
            return res.status(401).json({message:"user not found"});
           

        }
        // get all the user data whom this user is following from it following list
        const following=user.following;
        // show only this user post whose postedBy id matches the id present in logged in user following array
        const feedPosts=await Post.find({postedBy :{$in: following}}).sort({createdAt:-1});
        console.log("FeedPosts" , feedPosts);
        
        res.status(201).json(feedPosts);
        
    } catch (error) {
        res.status(500).json(error.message)
        console.log("error while  getting  post feed " ,error)
        
    }
}
const getUserPosts= async(req ,res)=>
{
    const{username}=req.params;
    try {
        const user= await User.findOne({username});
        if(!user)
        {
            return res.status(401).json({error:"user not found"});
        }
        // sort in descending order latest post  at first
        const posts= await Post.find({postedBy:user._id}).sort({createdAt:-1})
        res.status(200).json(posts);
        
    } catch (error) {
        return res.status(401).json({error:error.message});
        
    }
}
export  {createPost ,getPost ,deletePost , likeUnlikePost , replyPost ,getFeedPost , getUserPosts} 