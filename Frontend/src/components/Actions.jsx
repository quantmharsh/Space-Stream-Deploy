import React from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
// convert post prrop to post_(just changing name)
const Actions = ({post }) => {
	
const { isOpen, onOpen, onClose } = useDisclosure()
	const user= useRecoilValue(userAtom);
	const showToast= useShowToast();
	

	const [liked, setLiked] = useState(post.likes.includes(user?._id));
	
	const[posts , setPosts]=useRecoilState(postsAtom);
	const[reply , setReply]=useState("")
	// setIsLiking state is used to stop user from sending multiple request to api before completion on prev request

	const[isLiking , setIsLiking]=useState(false);
	const[isReply , setIsReply]=useState(false);
	const handleLikeAndUnlike=async()=>{
		if(!user)
		{
		 return	showToast("Error" ,"You Must be logged in to like the post" ,"error");
		}
		if(isLiking) 
		{
			return;
		}
		setIsLiking(true);
		try {
			const res= await fetch("/api/posts/like/"+post._id,{
				method:"PUT",
				headers:{
					"Content-Type":"application/json",
				},
			});
			const data= await res.json();
			if(data.error){ return showToast("Error" ,data.error,"error");
		}
		console.log("Data in Actions " ,data);
		if(!liked)

		{
			 const updatedPost= posts.map((p)=>{
				if(p._id===post._id)
				{
					return  {...p , likes: [...p.likes ,user._id]}
				}
				return p;
			 })
			 setPosts(updatedPost);

		}
		else{
			// setPost({...post , likes: post.likes.filter((id)=> id!== user._id) });
			const updatedPost= posts.map((p)=>{
				if(p._id===post._id)
				{
					return {...p , likes: p.likes.filter((id)=> id!== user._id) }
				}
				return p;
			})
			setPosts(updatedPost);
		}
			setLiked(!liked);
			
			
		} catch (error) {
			showToast("Error" ,error.message,"error")
			
		}
		finally{
			setIsLiking(false);
		}
	}
	const handleReply =async()=>{

		if(!user)
		{
			showToast("Error" , "Login to Reply" ,"error")
		}
		if(isReply)
		{return;
		}
		setIsReply(true);
		try {
			const res= await fetch("/api/posts/reply/"+post._id,{
				method:"PUT",
				headers:{
					"Content-Type":"application/json",
				},
				// since we  are storing  reply in field named text so changing it 
				body:JSON.stringify({text:reply}),
			})
			const data= await res.json();
			if(data.error)
			{
				showToast("Error" ,data.error ,"error");
			}
			// storing only reply from  data in replies otherwise it will store complete info
			//  this was enough but for optimization we have used updatedposts 
			// setPost({...post  , replies:[...post.replies , data.reply]})
			const updatedPosts=posts.map((p)=>{
				if(p._id===post._id)
				{
					return{...p , replies:[...p.replies ,data ]}
				}
				return p;
			})
			setPosts(updatedPosts);
			showToast("Success" ,"Reply post Successfully" , "success");
			console.log("data in handle replyy ",data);
			
			onClose();
			setReply("")
			
			
		} catch (error) {
			showToast("Error" , error.message,"error")
			
		}
		finally{
			setIsReply(false);
		}
	}
	return (
		<Flex flexDirection={"column"}>
		<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
			<svg
				aria-label="Like"
				color={liked ? "rgb(237, 73, 86)" : ""}
				fill={liked ? "rgb(237, 73, 86)" : "transparent"}
				height="19"
				role="img"
				viewBox="0 0 24 22"
				width="20"
				onClick={handleLikeAndUnlike}
			>
				<path
					d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
					stroke="currentColor"
					strokeWidth="2"></path>
			</svg>

			<svg
				aria-label="Comment"
				color=""
				fill=""
				height="20"
				role="img"
				viewBox="0 0 24 24"
				width="20"
				onClick={onOpen}
			>
				<title>Comment</title>
				<path
					d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
					fill="none"
					stroke="currentColor"
					strokeLinejoin="round"
					strokeWidth="2"></path>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				color=""
				fill=""
				height="20"
				role="img"
				width="20"
				viewBox="0 0 80 80">
				<path
					d="M 63 7 C 57.488281 7 53 11.488281 53 17 C 53 17.289063 53.019531 17.574219 53.046875 17.859375 L 23.453125 32.375 C 21.710938 30.898438 19.460938 30 17 30 C 11.488281 30 7 34.488281 7 40 C 7 45.511719 11.488281 50 17 50 C 19.460938 50 21.710938 49.101563 23.453125 47.625 L 53.046875 62.140625 C 53.019531 62.425781 53 62.710938 53 63 C 53 68.511719 57.488281 73 63 73 C 68.511719 73 73 68.511719 73 63 C 73 57.488281 68.511719 53 63 53 C 60.695313 53 58.574219 53.792969 56.878906 55.109375 L 26.976563 40.4375 C 26.984375 40.292969 27 40.148438 27 40 C 27 39.851563 26.984375 39.707031 26.976563 39.5625 L 56.878906 24.890625 C 58.574219 26.207031 60.695313 27 63 27 C 68.511719 27 73 22.511719 73 17 C 73 11.488281 68.511719 7 63 7 Z M 63 9 C 67.429688 9 71 12.570313 71 17 C 71 21.429688 67.429688 25 63 25 C 58.570313 25 55 21.429688 55 17 C 55 12.570313 58.570313 9 63 9 Z M 63 11 C 62.449219 11 62 11.449219 62 12 C 62 12.550781 62.449219 13 63 13 C 63.550781 13 64 12.550781 64 12 C 64 11.449219 63.550781 11 63 11 Z M 59.480469 12.464844 C 59.207031 12.460938 58.945313 12.566406 58.753906 12.757813 C 58.367188 13.148438 58.367188 13.78125 58.753906 14.171875 C 59.144531 14.5625 59.78125 14.5625 60.171875 14.171875 C 60.558594 13.78125 60.558594 13.148438 60.171875 12.757813 C 59.984375 12.574219 59.738281 12.46875 59.480469 12.464844 Z M 66.550781 12.464844 C 66.28125 12.460938 66.019531 12.566406 65.828125 12.757813 C 65.4375 13.148438 65.4375 13.78125 65.828125 14.171875 C 66.21875 14.5625 66.851563 14.5625 67.242188 14.171875 C 67.632813 13.78125 67.632813 13.148438 67.242188 12.757813 C 67.058594 12.574219 66.8125 12.46875 66.550781 12.464844 Z M 58 16 C 57.449219 16 57 16.449219 57 17 C 57 17.550781 57.449219 18 58 18 C 58.550781 18 59 17.550781 59 17 C 59 16.449219 58.550781 16 58 16 Z M 68 16 C 67.449219 16 67 16.449219 67 17 C 67 17.550781 67.449219 18 68 18 C 68.550781 18 69 17.550781 69 17 C 69 16.449219 68.550781 16 68 16 Z M 59.480469 19.535156 C 59.207031 19.53125 58.949219 19.636719 58.757813 19.828125 C 58.367188 20.21875 58.367188 20.851563 58.757813 21.242188 C 59.148438 21.632813 59.78125 21.632813 60.171875 21.242188 C 60.5625 20.851563 60.5625 20.21875 60.171875 19.828125 C 59.988281 19.644531 59.738281 19.539063 59.480469 19.535156 Z M 66.550781 19.535156 C 66.28125 19.53125 66.019531 19.636719 65.828125 19.828125 C 65.4375 20.21875 65.4375 20.851563 65.828125 21.242188 C 66.21875 21.632813 66.851563 21.632813 67.242188 21.242188 C 67.632813 20.851563 67.632813 20.21875 67.242188 19.828125 C 67.058594 19.644531 66.8125 19.539063 66.550781 19.535156 Z M 53.433594 19.894531 C 53.828125 21.203125 54.484375 22.394531 55.34375 23.417969 L 26.667969 37.484375 C 26.320313 36.160156 25.714844 34.945313 24.902344 33.894531 Z M 63 21 C 62.449219 21 62 21.449219 62 22 C 62 22.550781 62.449219 23 63 23 C 63.550781 23 64 22.550781 64 22 C 64 21.449219 63.550781 21 63 21 Z M 17 32 C 21.429688 32 25 35.570313 25 40 C 25 44.429688 21.429688 48 17 48 C 12.570313 48 9 44.429688 9 40 C 9 35.570313 12.570313 32 17 32 Z M 17 34 C 16.449219 34 16 34.449219 16 35 C 16 35.550781 16.449219 36 17 36 C 17.550781 36 18 35.550781 18 35 C 18 34.449219 17.550781 34 17 34 Z M 20.546875 35.464844 C 20.277344 35.460938 20.019531 35.566406 19.828125 35.753906 C 19.4375 36.144531 19.4375 36.78125 19.828125 37.171875 C 20.21875 37.558594 20.851563 37.558594 21.242188 37.171875 C 21.632813 36.78125 21.632813 36.144531 21.242188 35.753906 C 21.058594 35.570313 20.808594 35.464844 20.546875 35.464844 Z M 13.480469 35.464844 C 13.207031 35.460938 12.945313 35.566406 12.753906 35.757813 C 12.367188 36.148438 12.367188 36.78125 12.753906 37.171875 C 13.144531 37.5625 13.78125 37.5625 14.171875 37.171875 C 14.558594 36.78125 14.558594 36.148438 14.171875 35.757813 C 13.984375 35.574219 13.738281 35.46875 13.480469 35.464844 Z M 12 39 C 11.449219 39 11 39.449219 11 40 C 11 40.550781 11.449219 41 12 41 C 12.550781 41 13 40.550781 13 40 C 13 39.449219 12.550781 39 12 39 Z M 22 39 C 21.449219 39 21 39.449219 21 40 C 21 40.550781 21.449219 41 22 41 C 22.550781 41 23 40.550781 23 40 C 23 39.449219 22.550781 39 22 39 Z M 26.667969 42.515625 L 55.34375 56.582031 C 54.484375 57.605469 53.828125 58.796875 53.433594 60.105469 L 24.902344 46.105469 C 25.714844 45.054688 26.320313 43.839844 26.667969 42.515625 Z M 13.480469 42.535156 C 13.207031 42.53125 12.949219 42.636719 12.757813 42.828125 C 12.367188 43.21875 12.367188 43.851563 12.757813 44.242188 C 13.148438 44.632813 13.78125 44.632813 14.171875 44.242188 C 14.5625 43.851563 14.5625 43.21875 14.171875 42.828125 C 13.988281 42.644531 13.738281 42.539063 13.480469 42.535156 Z M 20.550781 42.535156 C 20.28125 42.53125 20.019531 42.636719 19.828125 42.828125 C 19.4375 43.21875 19.4375 43.851563 19.828125 44.242188 C 20.21875 44.632813 20.851563 44.632813 21.242188 44.242188 C 21.632813 43.851563 21.632813 43.21875 21.242188 42.828125 C 21.058594 42.644531 20.8125 42.539063 20.550781 42.535156 Z M 17 44 C 16.449219 44 16 44.449219 16 45 C 16 45.550781 16.449219 46 17 46 C 17.550781 46 18 45.550781 18 45 C 18 44.449219 17.550781 44 17 44 Z M 63 55 C 67.429688 55 71 58.570313 71 63 C 71 67.429688 67.429688 71 63 71 C 58.570313 71 55 67.429688 55 63 C 55 58.570313 58.570313 55 63 55 Z M 63 57 C 62.449219 57 62 57.449219 62 58 C 62 58.550781 62.449219 59 63 59 C 63.550781 59 64 58.550781 64 58 C 64 57.449219 63.550781 57 63 57 Z M 59.480469 58.464844 C 59.207031 58.460938 58.945313 58.566406 58.753906 58.757813 C 58.367188 59.148438 58.367188 59.78125 58.753906 60.171875 C 59.144531 60.5625 59.78125 60.5625 60.171875 60.171875 C 60.558594 59.78125 60.558594 59.148438 60.171875 58.757813 C 59.984375 58.574219 59.738281 58.46875 59.480469 58.464844 Z M 66.546875 58.464844 C 66.277344 58.460938 66.019531 58.566406 65.828125 58.753906 C 65.640625 58.945313 65.535156 59.199219 65.535156 59.464844 C 65.535156 59.730469 65.640625 59.984375 65.828125 60.171875 C 66.21875 60.5625 66.851563 60.5625 67.242188 60.171875 C 67.429688 59.984375 67.535156 59.730469 67.535156 59.464844 C 67.535156 59.199219 67.429688 58.945313 67.242188 58.753906 C 67.058594 58.574219 66.808594 58.46875 66.546875 58.464844 Z M 58 62 C 57.449219 62 57 62.449219 57 63 C 57 63.550781 57.449219 64 58 64 C 58.550781 64 59 63.550781 59 63 C 59 62.449219 58.550781 62 58 62 Z M 68 62 C 67.449219 62 67 62.449219 67 63 C 67 63.550781 67.449219 64 68 64 C 68.550781 64 69 63.550781 69 63 C 69 62.449219 68.550781 62 68 62 Z M 66.546875 65.535156 C 66.277344 65.53125 66.019531 65.636719 65.828125 65.828125 C 65.4375 66.21875 65.4375 66.851563 65.828125 67.242188 C 66.21875 67.632813 66.851563 67.632813 67.242188 67.242188 C 67.632813 66.851563 67.632813 66.21875 67.242188 65.828125 C 67.058594 65.644531 66.808594 65.539063 66.546875 65.535156 Z M 59.480469 65.535156 C 59.207031 65.53125 58.945313 65.636719 58.753906 65.828125 C 58.367188 66.21875 58.367188 66.855469 58.753906 67.246094 C 59.144531 67.632813 59.78125 67.632813 60.171875 67.246094 C 60.558594 66.855469 60.558594 66.21875 60.171875 65.828125 C 59.984375 65.644531 59.738281 65.542969 59.480469 65.535156 Z M 63 67 C 62.449219 67 62 67.449219 62 68 C 62 68.550781 62.449219 69 63 69 C 63.550781 69 64 68.550781 64 68 C 64 67.449219 63.550781 67 63 67 Z"
					fill="none"
					stroke="currentColor"
					strokeLinejoin="round"
					strokeWidth="2"></path>
			</svg>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				color=""
				fill=""
				height="20"
				role="img"
				viewBox="0 0 24 24"
				width="20">
				<path
					d="M19 7a1 1 0 0 0-1-1h-8v2h7v5h-3l3.969 5L22 13h-3V7zM5 17a1 1 0 0 0 1 1h8v-2H7v-5h3L6 6l-4 5h3v6z"
					fill="none"
					stroke="currentColor"
					strokeLinejoin="round"
					strokeWidth="2"
				/>
			</svg>
			</Flex>
			<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.dark"} fontSize={"sm"} fontWeight={"bold"}>
							{post.replies.length} replies 
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.dark"}></Box>
						<Text color={"gray.dark"} fontSize={"sm"} fontWeight={"bold"}>
							
							{post.likes.length}
							 likes
						</Text>
					</Flex>
						
					{/* Modal for comment section */}
					<Modal
					
     
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
             
              <Input placeholder='Reply goes here' 
			  value={reply}
			  onChange={(e)=>setReply(e.target.value)}/>
            </FormControl>

        
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} size={"sm"}
			onClick={handleReply} isLoading={isReply}>
              Reply
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
	
		</Flex>
	);
};

export default Actions;
