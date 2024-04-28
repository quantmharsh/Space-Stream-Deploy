import { Flex , Button, Spinner, Box} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import SuggestedUsers from '../components/SuggestedUsers';
import UserSearch from '../components/UserSearch';

const HomePage = () => {
  
  
  const[posts , setPosts]=useRecoilState(postsAtom);
  const[loading , setLoading]=useState(true);
  const showToast= useShowToast();
  useEffect(() => {
     const getFeedPosts=async()=>{
         setLoading(true);
        //  setting this empty because when we were coming from user page to home page then flickering was happening
         //since its empty it will show loading state until we get data
         setPosts([])
     try {
      const res= await fetch("/api/posts/feed");
      const data= await res.json();
      console.log("Data from feed post ",data);
      setPosts(data);
      
     } catch (error) {
      showToast("error" , "error while getting feed ","error");
      
     }
     finally{
      setLoading(false);
     }
     }
     getFeedPosts();
  }, [showToast ,setPosts])
  
  return (
    <>
     <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={70}>
        <UserSearch/>
      {loading &&(
      <Flex justify={"center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )}
    {!loading && posts.length===0 &&(
      <h1> Follow Some Users to read the post</h1>
    )}
    {posts.map((post)=> (
      <Post key={post._id} post={post} postedBy={post.postedBy}/>

    ))}
      </Box>
      <Box flex={30} 
      display={{
        base:"none" , 
        md:"block"
      }}>
            <SuggestedUsers/>
      </Box>
     </Flex>
    </>
  )
}

export default HomePage