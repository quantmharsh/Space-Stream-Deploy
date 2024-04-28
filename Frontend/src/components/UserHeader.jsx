import React, { useState, useEffect } from "react";
import {
	useToast,
	VStack,
	Flex,
	Box,
	Avatar,
	Text,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Portal,
	Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const showToast = useShowToast();
	const location = useLocation();
	const currentUser = useRecoilValue(userAtom);

	// const [following, setFollowing] = useState(false);
    // const[updating , setUpdating]=useState(false);
    const { handleFollowUnfollow, following, updating  , setFollowing} = useFollowUnfollow(user);
	


	// Use useEffect to set the state after ensuring all necessary data is available
	useEffect(() => {
		// Check if user, user.followers, currentUser, and currentUser.user are defined
		if (
			user &&
			user.followers &&
			currentUser &&
			currentUser &&
			currentUser._id
		) {
			setFollowing(user.followers.includes(currentUser?._id));
		}
	}, [user, currentUser]); // Add user and currentUser as dependencies so this effect runs when they change

	console.log("following", following);
    console.log("user at top" ,user);
	console.log("Current User at top" , currentUser)

	// Handling folow  unfolow
	// const handleFollowUnfollow = async () => {
    //     if(!currentUser)
    //     {
    //         showToast("error" ,"Please login to follow" ,"error")
    //         return;
    //     }
    //     setUpdating(true)
	// 	try {
	// 		const res = await fetch(`/api/users/follow/${user._id}`, {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 		const data = await res.json();

	// 		if (data.error) {
	// 			showToast("error", data.error, "error");
	// 			return;
	// 		}
	// 		if (following) {
	// 			showToast("success", `Unfollowed ${user.name}`, "success");
	// 			   user.followers.pop();
	// 			console.log("after unfollow", user.followers);
	// 		} else {
	// 			showToast("success", `Followed ${user.name}`, "success");
	// 			console.log();
	// 			user.followers.push(currentUser?._id);
	// 			console.log("currentUser._id ",currentUser._id)
	// 			// console.log("currentUser.user._id", currentUser.user._id);
	// 			// console.log(" after user follows", user.followers);
	// 		}

	// 		setFollowing(!following);
	// 		console.log(data);
	// 	} catch (error) {
    //         showToast("Error" ,error ,"error")

    //     }finally{
    //         setUpdating(false);
    //     }
	// };

	const copyURL = () => {
		const currentUrl = window.location.href;
		navigator.clipboard.writeText(currentUrl).then(() => {
			showToast("success" , "copied succesfully" ,"success");
		});
	};

	// Simplify the match logic to determine if it's the posts or replies page
	// Assuming posts page URL is '/username' and replies page URL is '/username/replies'
	const isPostPage = location.pathname.match(/\/[^/]+$/) !== null;
	const isRepliesPage = location.pathname.match(/\/[^/]+\/replies$/) !== null;

	console.log("user _id", user._id);
    console.log("user" , user);
    // console.log("current user id", currentUser.user._id);
	console.log("Current User", currentUser);
	
	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"}>{user.name}</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"} fontWeight={"bold"}>
							{user.username}
						</Text>
						<Text
							fontSize={"xs"}
							color={"gray.light"}
							bg={"gray.dark"}
							p={1}
							borderRadius={"full"}>
							threads.net
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src="https://bit.ly/broken-link"
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>
			<Text>{user.bio}</Text>

			{currentUser._id=== user._id && (
				<Link as={RouterLink} to="/update">
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.dark"}>
						{user?.followers?.length || 0} Followers
					</Text>

					<Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
					<Link color={"gray.dark"} href="https://instagram.com" isExternal>
						instagram.com
					</Link>
				</Flex>
				<Flex>
					<Box className="icon-container">
					<Link href="https://instagram.com" isExternal> 
						<BsInstagram size={24} cursor={"pointer"}/>
						     
							</Link>
					</Box>
					<Box className="icon-container">
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy Link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={"full"}>
				<Flex
					flex={1}
					cursor={"pointer"}
					justifyContent={"center"}
					pb={3}
					borderBottom={isPostPage ? "1.5px solid white" : "1.5px solid gray"}
					// color={isPostPage ? "white" : "gray.dark"}>
					//     color={}
				>
					<Text fontWeight={"bold"}>Posts</Text>
				</Flex>

				<Flex
					flex={1}
					cursor={"pointer"}
					justifyContent={"center"}
					pb={3}
					color={"gray.dark"}
					borderBottom={
						isRepliesPage ? "1.5px solid white" : "1.5px solid gray"
					}
					// color={isRepliesPage ? "white" : "gray.dark"}
				>
					<Text fontWeight={"bold"}>Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
