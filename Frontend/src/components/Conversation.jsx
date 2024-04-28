import { Avatar, AvatarBadge, Flex, Stack, WrapItem, useColorModeValue  ,Text, Image, Box} from '@chakra-ui/react'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import  userAtom from "../atoms/userAtom"
import {BsCheck2All, BsFillImageFill} from "react-icons/bs"
import {selectedConversationAtom} from "../atoms/messagesAtom"


const Conversation = ({conversation , isOnline}) => {
  const user=  conversation.participants[0];
  const lastmessage= conversation.lastMessage;
  
  const[selectedConversation , setSelectedConversation]=useRecoilState(selectedConversationAtom)

  const currentUser= useRecoilState(userAtom);
  console.log("selectedConversation" ,selectedConversation);
  console.log("conversation" , conversation);
  console.log("conversation id" , conversation._id)
  console.log("user" , user);
  console.log( "current user._id" ,currentUser[0]._id) 
  return (

    <Flex
    gap={4}
    alignItems={"center"}
    p={"1"}
    _hover={{
        cursor:"pointer",
        bg:useColorModeValue("gray.600" ,"gray.dark"),
        color:"white"
    }}
    borderRadius={"md"}
    onClick={()=>
      setSelectedConversation({
        _id:conversation._id,
        userId:user._id,
        username:user.username,
        userProfilePic:user.profilePic,
        // mock field is  to determine if user previouslty have chat with this user or not
        //if no then we will show nothing in right conversation container because there is no message
        //only name of the user(reciver) will be shown.used it in chatpage for mock Conversation
        
        mock:conversation.mock
      })
    

    }
    >

    {/* AVATAR ON LEFT SIDE WITH PIC OF USER */}
    <WrapItem>
        <Avatar size={{sm:"sm" ,base:"xs" ,md:"md"}} src={user?.profilePic}>
           <AvatarBadge boxSize={"1em"} bg={isOnline?"green.500":"gray.500"}/>
        </Avatar>
    </WrapItem>
    <Stack direction={"column"} fontSize={"small"}>
        <Text fontWeight={"xs"} display={"flex"} alignItems={"center"}  gap={1}>
         
           {user?.username} <Image src= "./verified.png " w={4} h={4} ml={1}/>
        </Text>

        <Text fontSize={"xs"} display={"flex"}alignItems={"center"} gap={1}> 
        {currentUser[0]?._id ===lastmessage.sender ? (
          <Box color={lastmessage.seen ?"blue.400":""}>
            <BsCheck2All size={16}/>
          </Box>
        )  :""}
        {lastmessage.text.length>18? lastmessage.text.substring(0 ,18)+"..." :lastmessage.text|| <BsFillImageFill size={16}/> }</Text>
 

    </Stack>
    </Flex>
  )
}

export default Conversation