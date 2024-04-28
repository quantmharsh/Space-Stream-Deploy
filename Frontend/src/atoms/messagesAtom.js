import { atom } from "recoil";
export const conversationsAtom =atom({
    key:"conversationsAtom" ,
    default:[],
}) 
export const   selectedConversationAtom =atom({
    key:"selectedConversationAtom",
    default:{
        _id:"",
        // user id is of a user to whom we are cchatting so that we can open it on rightside where conversation 
        //is their between two suer
        userId:"",
        username:"",
        userProfilePic:""
    }
})
