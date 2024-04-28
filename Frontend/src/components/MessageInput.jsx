import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import {IoSendSharp} from "react-icons/io5"
import React, { useRef, useState } from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import useShowToast from '../hooks/useShowToast';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg';

const MessageInput = ({setMessages}) => {
  const[messageText , setMessageText]=useState('');
  const selectedConversation= useRecoilValue(selectedConversationAtom)
  const showToast= useShowToast();
  const setConversations=useSetRecoilState(conversationsAtom)
  
const imageRef= useRef(null);
const {onClose}=useDisclosure();
// using usePreviewImg hook which we created previously  for previewing the image
const { handleImageChange,imgUrl, setImgUrl} = usePreviewImg();
const [isSending , setIsSending] = useState(false);
  const handleSendMessage= async(e)=>{
    // if input  field is empty  then return
    e.preventDefault();
    if(!messageText && !imgUrl)
    {
      return;
    }
    // if user is already sending 1 img then wait until that image is successfully uploaaded
    if(isSending)
    {
      return;
    }

    try {
      setIsSending(true);
      const res= await fetch('/api/messages',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          message:messageText,
          recipientId:selectedConversation.userId,
          img: imgUrl
        })

      })
       const data= await res.json();
       if(data.error)
       {
        showToast("Error" ,data.error ,"error");
        return;
       }
       console.log("Data in handlesend message " , data);
       setMessages((messages)=>[...messages , data ]);
       //also update the lastmessage at left part where all chats are theres
       setConversations(prevConvs  =>{
        const updatedConversations = prevConvs.map(conversation => {
          if(conversation._id===selectedConversation._id)
          {
            return {
              ...conversation,
              lastMessage:{
                text:messageText,
                sender:data.sender
              }
            }
          }
          return conversation
        })
        return updatedConversations;
       })

       setMessageText("")
       setImgUrl("")
       return;

      
    } catch (error) {
      showToast("Error" ,error.message,"error");
      
    }
    finally{
      setIsSending(false);
    }

  }
 
  return (
    <Flex gap={2} alignItems={"center"}>
    <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder='Type a message'
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
    <Flex flex={5} cursor={"pointer"}>
      <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
      <Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
    </Flex>
    <Modal
      isOpen={imgUrl}
      onClose={() => {
        onClose();
        setImgUrl("");
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex mt={5} w={"full"}>
            <Image src={imgUrl} />
          </Flex>
          <Flex justifyContent={"flex-end"} my={2}>
            {!isSending ? (
              <IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
            ) : (
              <Spinner size={"md"} />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  </Flex>

);
}

export default MessageInput