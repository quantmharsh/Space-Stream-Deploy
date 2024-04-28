import { Avatar, Flex ,Text , Image , Box, Divider, Button, Spinner } from '@chakra-ui/react'
import React, { useState ,useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useGetUserProfile from '../hooks/useGetUserProfile'
import useShowToast from '../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import {formatDistanceToNow} from "date-fns";
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import {DeleteIcon} from "@chakra-ui/icons"
import postsAtom from '../atoms/postsAtom'

const PostPage = () => {

  const[liked , setLiked]=useState(false)
  const {user , loading} = useGetUserProfile();
  // const[post , setPost]=useState(null)
  const showToast= useShowToast();
  const {pid}=useParams();
  const currentUser=useRecoilValue(userAtom)
  const[posts , setPosts]=useRecoilState(postsAtom)
  const navigate= useNavigate();
  const currentPost= posts[0];
  useEffect(() => {
      
       const getPost=async()=>
       {
        setPosts([])
        try {
          const res= await fetch(`/api/posts/${pid}`);
          const data= await res.json();
          if(data.error)
          {
            showToast("Error" ,data.error,"error");
            return;
          }
          console.log("Data in getpost 2 ", data);
          // setPost(data);
          // store it in the form of array because in actions component we are looping over it 
          setPosts([data]);
          
        } catch (error) {
          showToast("Error" ,error.message ,"error");
        }
       }
       getPost();
  }, [pid , showToast ,setPosts])
  
  const handleDeletePost =async()=>
	{
		
		try {
		
			if(!window.confirm("Are you sure you want to delete this post")) return;
			const res= await fetch(`/api/posts/${currentPost._id}` ,{
				method:"DELETE"
			})
			const data= await res.json();
			console.log("Data in handledelete",data);
			if(data.error)
			{
				showToast("Error",data.error,"error")
				return;
			}
			showToast("Success","Post deleted successfully","success")
      navigate(`/${user.username}`);
			// setPosts(posts.filter((p) => p._id !== post._id));
			
			
		} catch (error) {
			showToast("Error" ,error.message,"error");
			
			
		}
	}
  if(!user && loading)
  {
    return(
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }
  if(!currentPost)
  {
    return null;
  }
  return (
    <>
   <Flex>
    <Flex w={"full"} alignItems={"center"} gap={3}>
      <Avatar src={user.profilePic} size={"md"} name="mark zuckerberg"/>
      <Flex>
           <Text fontSize={"sm"} fontWeight={"bold"}> {user.username}</Text>
           <Image src='/verified.png' w={4} h={4} ml={4}/>
      </Flex>
    


    </Flex>
    <Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.dark"}>
								{formatDistanceToNow(new Date(currentPost.createdAt))} ago
							</Text>
							{/* This ? is very imp it gived lot of bug when not used it
							specially in post and userHeader components */}
							{console.log( "currentUser in Post 2" ,currentUser._id)}
							
							{console.log( "User in Post " ,user)}
							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} cursor={"pointer"} />}
							
						</Flex>
   </Flex>
   <Text my={3}>{currentPost.text}</Text>

   {/* if post has image then only loa the post otherwise it will throw error */}
          {currentPost.img && (
               <Box
               borderRadius={6}
               overflow={"hidden"}
               border={"1px solid"}
               borderColor={"gray.light"}>
               <Image src={currentPost.img} w={"full"} />
             </Box>
          )}
           <Flex>
            <Actions  post={currentPost}/>
           </Flex>
          
           <Divider my={4} />
           <Flex justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"2xl"}>👋</Text>
              <Text color={"gray.dark"}> Get the app to reply , like , post</Text>
            </Flex>
            <Button>Get</Button>

           </Flex>
           <Divider/>
           {currentPost.replies.map((reply)=>(
         
              <Comment key={reply._id} reply={reply} lastReply={reply._id===currentPost.replies[currentPost.replies.length-1]._id}/>
           ))}
           {/* {/* <Comment comment="nice pic" createdAt="2d" likes={21} userName={"harsh"} userAvatar={'https://bit.ly/dan-abramov'}/> */}
          
         
   </>
  )
}

export default PostPage