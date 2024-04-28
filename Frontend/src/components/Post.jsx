import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
// for showing when post was posted 
import {formatDistanceToNow} from "date-fns";
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({post , postedBy }) => {
	
	const[user , setUser]=useState(null);
	const navigate= useNavigate();
	const currentUser=useRecoilValue(userAtom);
	const[posts , setPosts]=useRecoilState(postsAtom);
	
	const showToast= useShowToast();
	useEffect(() => {
		const getUser=async()=>
		{
			try {
				const res = await fetch("/api/users/profile/" +postedBy )
                const data= await res.json();
				console.log("Data in post" ,data);
				if(data.error)
				{
					showToast("Error",data.error,"error")
				}
				setUser(data);
				
				
			} catch (error) {
				showToast("Error" ,error.message,"error");
				setUser(null);
			}
		
		}
		getUser();
	
	}, [postedBy , showToast])
	const handleDeletePost =async(e)=>
	{
		
		try {
			e.preventDefault();
			if(!window.confirm("Are you sure you want to delete this post")) return;
			const res= await fetch(`/api/posts/${post._id}` ,{
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
			// to show the post without referesing the page we ar doing this . 
			setPosts(posts.filter((p) => p._id !== post._id));
			
			
		} catch (error) {
			showToast("Error" ,error.message,"error");
			
			
		}
	}
	if (!user) return null;
	
	return (
		<Link to={`/${user?.username}/post/${post._id}`}>
			<Flex gap={3} mb={4} py={5}>
				{/* for left part where user profile pic will be shown and white line  */}
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size={"md"} name={user?.name} src={user?.profilePic}
					 onClick={(e)=>{
						e.preventDefault();
						navigate(`/${user.username}`)
					 }} />
					{/* for line on left side */}
					<Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
					{/* for people who liked post */}
					<Box position={"relative"} w={"full"}>
						{post.replies.length===0 &&(
							<Text textAlign={"center"}>🥱</Text>
						)}
						{post.replies[0]&&(
								<Avatar
								size="xs"
								name="harsh"
								src={post.replies[0].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
							/>

						)}
						{post.replies[1]&&(
								<Avatar
								size="xs"
								name="harsh"
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
							/>

						)}
						{post.replies[2]&&(
								<Avatar
								size="xs"
								name="harsh"
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								top={"0px"}
								left={"15px"}
								padding={"2px"}
							/>

						)}
					
					
					</Box>
				</Flex>
				{/* for right side part where post will be shown */}
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}
							// to go to profile of user who have posted this
							 onClick={(e)=>{
								e.preventDefault();
								navigate(`/${user.username}`)
							 }}>
								{user?.username} 
							</Text>
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.dark"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
							{/* This ? is very imp it gived lot of bug when not used it
							specially in post and userHeader components */}
							{console.log( "currentUser in Post 2" ,currentUser._id)}
							
							{console.log( "User in Post " ,user)}
							{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
							
						</Flex>
					</Flex>

					{/* for post */}
					<Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (<Box
						borderRadius={6}
						overflow={"hidden"}
						border={"1px solid"}
						borderColor={"gray.light"}>
						<Image src={post.img} w={"full"} />
					</Box>)}
					
					<Flex gap={3} my={1}>
						<Actions post={post}/>
					</Flex>

					
				</Flex>
			</Flex>
		</Link>
	);
};

export default Post;