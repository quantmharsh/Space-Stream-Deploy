import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Box  ,Flex ,Text , Input, useColorMode, useColorModeValue, SkeletonCircle, Skeleton, Avatar, Image, Divider } from "@chakra-ui/react";
import Message from './Message';
import MessageInput from './MessageInput';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext.jsx';
import messageSound from "../assets/sounds/message.mp3"


const MessageContainer = () => {
  const showToast= useShowToast();
  const[selectedConversation , setSelectedConversation]=useRecoilState(selectedConversationAtom)
  const[loadingMessages , setLoadingMessages]=useState(true);
  const[messages , setMessages]=useState([])
  const currentUser= useRecoilValue(userAtom)
  
  const setConversations = useSetRecoilState(conversationsAtom)
  const messageEndRef=useRef(null);
  //use effecct for updating message using web socket 
  //here we are listening for incoming request. 
  //destruct the  value which we are getting from useSocket
  const { socket }= useSocket();
  useEffect(() => {

    if(socket)
    {
    socket.on("newMessage" ,(message)=>{ 
      // console.log("selected conversation id" , selectedConversation._id);
      // console.log("message.conversation id" , message.conversationId);
    
      // Playing notification sound
      if(!document.hasFocus())
      {
        const sound= new Audio(messageSound);
        sound.play();
      }                    
     

       if(selectedConversation._id=== message.conversationId)
       {
            setMessages((prevMessages)=> [...prevMessages , message]); 
       }


    
      //for updating last message when using socket we want to update it in real time
      setConversations((prev)=>{
        const updatedConversations =prev.map(conversation=>{
          if(conversation._id===message.conversationId)
          {
            // console.log("conversation id" , conversation._id);
            return{
              ...conversation ,
               lastMessage:{
                text:message.text,
                sender:message.sender
               }
            }
          }
          return conversation;
        })
        return updatedConversations;
      })
    

    })
  }

    // after this  unmount  the socket
    return()=> socket.off("newMessage");
   
  }, [socket , selectedConversation , setConversations ])


  // useeffect for marking messages as seen 
  useEffect(() => {
    // checking whether  lastmessage is from loged in user or reciver to whom we are chatting with . if reciver then  do socket.emit
    const lastMessageIsFromOtherUser = messages.length &&  messages[messages.length-1].sender!== currentUser._id
    if(lastMessageIsFromOtherUser)
    {
      socket.emit("markMessagesAsSeen" ,{
        conversationId:selectedConversation._id ,
        // userid of user with whom we are chatting
        userId:selectedConversation.userId

      })
    }
    //listening for event
    socket?.on("messagesSeen" , ({conversationId})=>{
      if(conversationId=== selectedConversation._id)
      {
         setMessages((prev)=>{
          const updatedMessages=prev.map((message)=>{
            if(!message.seen)
            {
              return {
                ...message ,
                seen:true ,
              };
            }
            return message;
          });
          return updatedMessages;
         })
      }
    })

  }, [socket , selectedConversation , currentUser._id ,messages ])
  
  
  useEffect(() => {
    const getMessages=async()=>{
      setLoadingMessages(true);
      setMessages([]);
      try {
        if(selectedConversation.mock)
        {
          return;
        }
          if(selectedConversation.userId)
          {
         const res= await fetch(`/api/messages/${selectedConversation.userId}`)
         const data=  await res.json();
         if(data.error)
         {
          showToast("Error" ,data.error ,"error")
          return;
         }
         console.log("data in getMessages",data);
         setMessages(data)
        }
      } catch (error) {
        showToast("Error" ,error.message, "error");
        console.log(error.message);
        
      }
      finally{
          setLoadingMessages(false);
      }
    }
    getMessages();
   
  }, [showToast , selectedConversation.userId  , selectedConversation.mock ])

  useEffect(() => {
   messageEndRef.current?.scrollIntoView({behaviour:"smooth"});
  }, [messages])
  
  
  return (
    <Flex flex={70}  bg={useColorModeValue("gray.200" ,"gray.light")}
    borderRadius={"md"}
    flexDirection={"column"}
    p={2}
    
    >
    <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"}/>
        <Text display={"flex"} alignItems={"center"} >{selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} /> 
        </Text>

    </Flex>
    <Divider/>
    <Flex flexDir={"column"} gap={4} my={4} height={"400px"} overflowY={"auto"} p={2}>
        {loadingMessages &&(
              [0,1,2,3,4,5,6,7,8,9,10,11,12].map((_,i)=>(
                <Flex key={i} alignItems={"center"} gap={2} p={"1"} borderRadius={"md"} alignSelf={i%2===0?"flex-start":"flex-end"}> 
                    {i%2===0 && <SkeletonCircle size={7}/>}
                    <Flex flexDir={"column"} gap={2}> 
                    <Skeleton h={"8px"} width={"250px"}/>
                    <Skeleton h={"8px"} width={"250px"}/>
                    <Skeleton h={"8px"} width={"250px"}/>
                    
                    </Flex>
                    {i%2!==0 && <SkeletonCircle size={7}/>}
                    </Flex>
                  
              
               ))
        )}
       {!loadingMessages && (
        messages.map((message)=>(
          <Flex  key={message._id}  direction={"column"}
          ref={messages.length -1 === messages.indexOf(message) ?messageEndRef : null}
          >
          <Message   message={message} ownMessage={currentUser._id === message.sender} />
          </Flex>
       
        ))
       )}
       
         </Flex>
         <MessageInput  setMessages={setMessages} />

    </Flex>
  )
}

export default MessageContainer