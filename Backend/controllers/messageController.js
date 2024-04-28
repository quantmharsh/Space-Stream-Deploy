import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReciepentSocketId, io } from "../socket/socket.js";
import {v2  as cloudinary} from "cloudinary";


const sendMessage=async(req , res)=>{
    try {
        // get receiver and message from body
        const{recipientId , message}=req.body;
        let{img}=req.body;
        //sender will be the user who is logged in
        const senderId= req.user._id;
        //find whether previously both user have converastion or not
        let conversation = await Conversation.findOne( { 
            participants:{ $all : [senderId , recipientId]}
        });
        //if no conversation then create conversation object and save it
        if(!conversation)
        {
            conversation= new Conversation({
                participants:[senderId , recipientId],
                lastMessage:{
                    text:message,
                    sender: senderId
                }

            })
        }
        await conversation.save();
        // we have to also create message so doing this here
        //chek whether user is sending image also
        if(img)
        {
            const uploadedResponse= await cloudinary.uploader.upload(img);
            //after uploading image on cloudinary store it url in img and then on database
            img= uploadedResponse.secure_url;
        }
        const newMessage= new Message({
            conversationId: conversation._id,
            sender:senderId ,
            text:message,
            img:img||""
        });
        //using pomisies so that we can complete both task fast
        //we will save the message 
        //also will update the  lastmessaage in conversation model so that we can show it on screen latest message
        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage:{
                    text:message,
                    sender:senderId
                }
            })
        ])
        // using web socket for real time update to reciver which is sending event to 1 user  
        const recipientSocketId= getReciepentSocketId(recipientId);
        if(recipientSocketId)
        {
            io.to(recipientSocketId).emit("newMessage" , newMessage)
        }

        return   res.status(201).json(newMessage);
Q
        
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
}
const getMessages=async(req ,res)=>{
    const {otherUserId}=req.params;
    const userId= req.user._id;
    try {
         
        //   find converation
        const conversation =await Conversation.findOne({
            participants:{ $all :[userId , otherUserId]},
        })
        if(!conversation)
        {
            return res.status(404).json({error:"Conversation not  found..."})
        }
        // find all the  messages of this conversation
        const messages= await Message.find({
            conversationId:conversation._id
        }).sort({createdAt :1})
      res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
}
const getConversations=async(req ,res)=>{
    try {
        const userId= req.user._id;
        const converastions= await Conversation.find({ participants: userId}).populate(
            {
                path:"participants",
                select:" username  profilePic"

            }
        );
        // remove the current user from participants array to make it easy to use at frontend
        converastions.forEach((converastion) =>{
             converastion.participants =converastion.participants.filter(
                (participant) =>participant._id.toString()!== userId.toString()
             )
        })
         res.status(200).json(converastions);
        
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
}
export{sendMessage , getMessages , getConversations}