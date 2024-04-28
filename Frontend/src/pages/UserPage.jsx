import React, { useState, useEffect } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from '../components/Post';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';

const UserPage = () => {
  const{user , loading}=useGetUserProfile();
  // const[posts , setPosts]=useState([])
  const[posts , setPosts]=useRecoilState(postsAtom);
  const[fetchingPosts , setFetechingPosts]=useState(true);
  const showToast = useShowToast();
  const { username } = useParams();

  useEffect(() => {
    console.log("username " ,username)
 
    const getPosts=async()=>
    {
      // if user account is freezed then we will return 
      if(!user)
      {
        return;
      }
      setFetechingPosts(true);
      try {
        const res= await fetch(`/api/posts/user/${username}`);
        const data= await res.json();
        console.log("data in getposts" ,data);
        setPosts(data);

        
      } catch (error) {
        showToast("Error" , error.message,"error")
        setPosts([])
        

      }
      finally{
        setFetechingPosts(false);
      }
    }
  
    getPosts();
  }, [username, showToast , setPosts , user]);


  if (loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if(!user && !loading)
  {
    return <h1> User not found 🥲</h1>
  }

  return (
    <div>
      <UserHeader user={user}/>
      {/* <UserPost likes={269} replies={120} postImg="/post1.png" postTitle="Lets learn about react js "/>
      <UserPost likes={121} replies={43} postImg="/post2.png" postTitle="Discuss about learning node js and express js"/>
      <UserPost likes={790} replies={6140} postImg="/post3.png" postTitle="Important questions for leetcode"/> */}
      {!fetchingPosts && posts.length===0 &&(
           <h1> User Does not have any post to show</h1>
      )}
      {fetchingPosts &&(
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"}/>
          </Flex>
       
      )}
      {posts.map((post)=>(
        <Post key={post._id} post={post}  postedBy={post.postedBy} />
      ))}
    </div>
  );
};

export default UserPage;
