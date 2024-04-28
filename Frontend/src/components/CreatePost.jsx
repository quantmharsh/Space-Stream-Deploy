import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'

import React, { useRef, useState } from 'react'
import usePreviewImg from '../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../atoms/postsAtom'
import { useParams } from 'react-router-dom'


const CreatePost = () => {
 
    
    const MAX_CHAR=500;
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText , setPostText]=useState('');
    const[remainingChar , setRemainingChar]=useState(MAX_CHAR)
    const { handleImageChange , imgUrl , setImgUrl}=usePreviewImg();
    const imageRef= useRef();
    const user= useRecoilValue(userAtom)
    const showToast= useShowToast();
    const[loading , setLoading]=useState(false);
    const [posts , setPosts]=useRecoilState(postsAtom);
    const {username}=useParams();
    const handleTextChange=async(e)=>{
        const inputText= e.target.value;
        if(inputText.length> MAX_CHAR)
        {
            const truncatedText=inputText.slice(0 , MAX_CHAR);
            setRemainingChar(0);
            setPostText(truncatedText);
        }
        else{
            setPostText(inputText);
            setRemainingChar(MAX_CHAR- inputText.length);
        }


    }
    const handleCreatePost=async()=>{
    //  console.log("user id in CreatePost" , user.user._id)
     console.log("user id in CreatePost" , user._id)
    setLoading(true);
        try {
            const res= await fetch("api/posts/create",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({postedBy:user._id ,text:postText ,img:imgUrl })
            })
            const data= await res.json();
            if(data.message)
            {
                showToast("Success", "Post Created Successfully","success")
                // adding new post at top doing this to get new post without refereshing the page 
                // if we create post then page should be refereshed if we are on our profile page not on any other user page
                if(username===user.username)
                {
                  setPosts([data , ...posts]);
                }
             
                setPostText("")
                setImgUrl("")
                onClose();
                return;

            }
            
            showToast("Success", "Post Created Successfully","success")
            setPosts([data , ...posts]);
            // close model automatically if post is done
            setPostText("")
            setImgUrl("")
            onClose();
          
            
        } catch (error) {
            
            showToast("Error", "Unable to Create Post","error")
        }
        finally{
            setLoading(false);
        }

    }
    
    
  return (
    <>
    <Button
    bottom={10}
    right={5}
    position={"fixed"}
    
    bg={useColorModeValue("gray.300" ,"gray.dark")}
    onClick={onOpen}
    size={{base:"sm " , sm:"md"}}
    >
      <AddIcon/> 🚀
     </Button>
       <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl>
            <Textarea
            placeholder='Post Content Goes Here...'
            onChange={handleTextChange}
            value={postText}
            />
            <Text
             fontSize={"xs"}
             fontWeight={"bold"}
             textAlign={"right"}
             m={1}
             color={"gray.800"}
             >
                {remainingChar}/{MAX_CHAR}
            </Text>
            <Input type="file"
             hidden
            ref={imageRef}
            onChange={handleImageChange}
             />
             <BsFillImageFill style={{marginLeft:"5px" , cursor:"pointer"}} size={16} onClick={()=>imageRef.current.click()}/>
          </FormControl>
           {imgUrl &&(
            <Flex mt={5} w={"full"} position={"relative"}>
             <Image src={imgUrl} alt="Selected image"/>
             <CloseButton
             onClick={()=>{
                setImgUrl("")
             }}
             bg={"gray.800"}
             position={"absolute"}
             top={2}
             right={2} />
            </Flex>
           )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post 🚀
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost