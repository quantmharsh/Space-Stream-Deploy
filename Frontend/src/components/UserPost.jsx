import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";

const UserPost = ({likes , replies  , postImg , postTitle}) => {
	const [liked, setLiked] = useState(false);
	return (
		<Link to={"/markzuckerberg/post/1"}>
			<Flex gap={3} mb={4} py={5}>
				{/* for left part where user profile pic will be shown and white line  */}
				<Flex flexDirection={"column"} alignItems={"center"}>
					<Avatar size={"md"} name="mark " src="/zuck-avatar.png" />
					{/* for line on left side */}
					<Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
					{/* for people who liked post */}
					<Box position={"relative"} w={"full"}>
						<Avatar
							size="xs"
							name="harsh"
							src="https://bit.ly/kent-c-dodds"
							position={"absolute"}
							top={"0px"}
							left={"15px"}
							padding={"2px"}
						/>
						<Avatar
							size="xs"
							name="harsh"
							src="https://bit.ly/ryan-florence"
							position={"absolute"}
							bottom={"0px"}
							right={"-5px"}
							padding={"2px"}
						/>
						<Avatar
							size="xs"
							name="harsh"
							src="https://bit.ly/sage-adebayo"
							position={"absolute"}
							bottom={"0px"}
							left={"4px"}
							padding={"2px"}
						/>
					</Box>
				</Flex>
				{/* for right side part where post will be shown */}
				<Flex flex={1} flexDirection={"column"} gap={2}>
					<Flex justifyContent={"space-between"} w={"full"}>
						<Flex w={"full"} alignItems={"center"}>
							<Text fontSize={"sm"} fontWeight={"bold"}>
								Mark Zuckerberg
							</Text>
							<Image src="/verified.png" w={4} h={4} ml={1} />
						</Flex>
						<Flex gap={4} alignItems={"center"}>
							<Text fontStyle={"sm"} color={"gray.dark"}>
								1d
							</Text>
							<BsThreeDots />
						</Flex>
					</Flex>

					{/* for post */}
					<Text fontSize={"sm"}>{postTitle}</Text>
                    {postImg && (<Box
						borderRadius={6}
						overflow={"hidden"}
						border={"1px solid"}
						borderColor={"gray.light"}>
						<Image src={postImg} w={"full"} />
					</Box>)}
					
					<Flex gap={3} my={1}>
						<Actions liked={liked} setLiked={setLiked} />
					</Flex>

					<Flex gap={2} alignItems={"center"}>
						<Text color={"gray.dark"} fontSize={"sm"} fontWeight={"bold"}>
							{replies} replies
						</Text>
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.dark"}></Box>
						<Text color={"gray.dark"} fontSize={"sm"} fontWeight={"bold"}>
							
							{likes} likes
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Link>
	);
};

export default UserPost;
