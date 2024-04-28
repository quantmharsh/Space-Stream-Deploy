import React, { useEffect, useState } from "react";
import { Button, Container, Box  ,Flex ,Text , Input, useColorMode, useColorModeValue, SkeletonCircle, Skeleton, useRadio } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Conversation from "../components/Conversation";
import {GiConversation} from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from "recoil";
import{ conversationsAtom, selectedConversationAtom} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
const ChatPage = () => {
  const showToast= useShowToast();
  const[loadingConversations , setLoadingConversations]=useState(true);
  const[conversations , setConversations]= useRecoilState(conversationsAtom);
  const[selectedConversation , setSelectedConversation]=useRecoilState(selectedConversationAtom);
  // loading state
  const[searchingUser , setSearchingUser]=useState(false);
  const[searchText , setSearchText]=useState("")
  const currentUser= useRecoilValue(userAtom);

  //  useSocket context to chech user online or not
  const{onlineUsers , socket} =useSocket();

  useEffect(() => {
   socket.on("messagesSeen" , ({conversationId})=>{
    setConversations(prev => {
      const updatedConversations= prev.map(conversation=>{
        if(conversation._id===conversationId)
        {
          return {
            ...conversation,
            lastMessage:{
              ...conversation.lastMessage,
              seen:true
            }
          }
        }
        return conversation;
      })
      return updatedConversations;
    })
   })
  }, [socket , setConversations])
  
  useEffect(() => {
    
    const getConversations=async()=>
    {
      try {
        const res= await fetch("/api/messages/conversations");
        const data= await res.json();
        if(data.error)
        {
          showToast("Error" ,data.error ,"error")
          return;
        }
        console.log("Data in get conversations" ,data);
        
        setConversations(data)
      } catch (error) {
        showToast("Error" ,error.message ,"error")
        
      }
      finally
      {
        setLoadingConversations(false)
      }
    }
    getConversations();
  
 
  }, [showToast , setConversations])



  const handleConversationSearch=async(e)=>{
    e.preventDefault();
    setSearchingUser(true);


    try {
      const res= await fetch(`/api/users/profile/${searchText}`);
      const searchedUser= await res.json();
      console.log("Searched User" , searchedUser);
      if(searchedUser.error)
      {
      showToast("Error" ,searchedUser.error,"error")

      }
      // if searched user is user who is logged in then return error

      if(searchedUser._id===currentUser._id)
      {
      showToast("Error" ,"Cant message yourself","error")
      return ;

      }
       if(conversations.find((conversation) => conversation.participants[0]._id=== searchedUser._id))
       {
        console.log("Searched user " ,searchedUser);
        setSelectedConversation({
          _id:conversations.find((conversation)=>conversation.participants[0]._id===searchedUser._id)._id,
          userId:searchedUser._id,
          username:searchedUser.username,
          userProfilePic:searchedUser.profilePic,
 
        })

      
      
        return;
       }
       const mockConversation={
        mock:true,
        lastMessage:{
          text:"",
          sender:""
        },
        _id: Date.now()
        ,
        participants:[
          {
            _id: searchedUser._id,
            username:searchedUser.username,
            profilePic:searchedUser.profilePic,
          }
        ]
       }
       setConversations( (prevConvs)=>[...prevConvs , mockConversation])
     
     
      

      
    }
     catch (error) {
      const here= "here"+error.message;

       
      showToast("Error" ,here ,"error")
      console.log(error.message);

      
    }
    finally{
      setSearchingUser(false);
    }
  }
  
  
	return (
		<Box
			position={"absolute"}
			left={"50%"}
			w={{lg:"750px" ,
    md:"80%",
  base:"100%"}}
  padding={4}
			// border={"1px solid pink"}
			transform={"translateX(-50%)"}>
			<Flex
      gap={4}
      flexDirection={{base:"column", md:"row"}}
      maxW={{
        sm:"400px",
        md:"full"
      }}
      mx={"auto"}
      
      >
        
        {/* for coversation */}
        <Flex
         flex={30} gap={2} flexDirection={"column"}maxW={{sm:"250px" , md:"full"}} mx={"auto"}>
             <Text fontWeight={700} color={useColorModeValue("gray.600" , "gray.400")}> Your chat appears here</Text>
             <form onSubmit={handleConversationSearch}>
              <Flex alignItems={"center"} gap={2}>
                <Input placeholder="Search for a user" onChange={(e)=> setSearchText(e.target.value)}/>
<Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>  <SearchIcon/> </Button>
              </Flex>
             </form>
             {loadingConversations && 
             [0,1,2,3,4].map((_,i)=>(
              <Flex key={i} alignItems={"center"} gap={4} p={"1"} borderRadius={"md"}> 
                <Box>
                  <SkeletonCircle size={10}/>
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}> 
                  <Skeleton h={"10px"} w={"80px"}/>
                  <Skeleton  h={"8px"} w={"90%"}/>
                  </Flex>
                
              </Flex>
             ))
              
              }
            {!loadingConversations &&(
              conversations.map(conversation =>
                (   <Conversation key={conversation._id}  
                  isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                  conversation={conversation}/>)
              )
          
            )}
        </Flex>
        {/* <Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} alignItems={"center"} justifyContent={"center"} height={"400px"}>
            <GiConversation size={100}/>
            <Text fontSize={20 }> Select a conversation to start messaging</Text>
        </Flex> */}
        {/* message container */}
        <Flex flex={70}> 
        <MessageContainer/>
         </Flex>


        
      </Flex>
		</Box>
	);
};

export default ChatPage;
