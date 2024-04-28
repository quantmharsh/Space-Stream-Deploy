import { Button, Container, Box  ,Flex ,Text , Input, useColorMode, useColorModeValue, SkeletonCircle, Skeleton, Avatar, Image } from "@chakra-ui/react";
import React, { useState } from 'react'
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ownMessage  , message}) => {
  const selectedConversation =useRecoilValue(selectedConversationAtom);
  const currentUser= useRecoilValue(userAtom);
  // setImgLoaded state is their to check whether img is completely loaded or not .
  //if it is completely loaded then only we will scoll down other wise wait till it completes
  const[imgLoaded , setImgLoaded]=useState(false);
  return (
    <>
    {/* if we send message */}
    {ownMessage ?(
         <Flex gap={2}
         alignSelf={"flex-end"}>
          {message.text &&(
              <Flex  bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}> {message.text} </Text>
              <Box alignSelf={"flex-end"}  ml={1} color={message.seen ? "blue.400" :""} fontWeight={"bold"}>
               <BsCheck2All size={16}/>
   
              </Box>
              </Flex>

          )}
           {message.img  && !imgLoaded &&(
            <Flex mt={5} w={"200px"}>
              <Image
              src={message.img}
              hidden  
              onLoad={()=> setImgLoaded(true)}
              alt="Message Image"
              borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"}/>
              </Flex>

          )}
           {message.img  && imgLoaded &&(
            <Flex mt={5} w={"200px"}>
              <Image
              src={message.img}
             
              alt="Message Image"
              borderRadius={4}
              />
               <Box alignSelf={"flex-end"}  ml={1} color={message.seen ? "blue.400" :""} fontWeight={"bold"}>
               <BsCheck2All size={16}/>
   
              </Box>
              
              </Flex>

          )}
        
           <Avatar w={7} h={7} src={currentUser.profilePic}/>
         </Flex>
    ):(
        // if we recive message
        <Flex gap={2}>
              <Avatar w={7} h={7} src={selectedConversation.userProfilePic}/>
              {message.text && (
                <Text maxW={"350px"}  bg={"gray.400"}  p={1} borderRadius={"md"}>{message.text}</Text>
         
              )}
               {message.img  && !imgLoaded &&(
            <Flex mt={5} w={"200px"}>
              <Image
              src={message.img}
              hidden  
              onLoad={()=> setImgLoaded(true)}
              alt="Message Image"
              borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"}/>
              </Flex>

          )}
           {message.img  && imgLoaded &&(
            <Flex mt={5} w={"200px"}>
              <Image
              src={message.img}
             
              alt="Message Image"
              borderRadius={4}
              />
              
              </Flex>

          )}

           
         </Flex>
    )}
  
   </>
  )
}

export default Message