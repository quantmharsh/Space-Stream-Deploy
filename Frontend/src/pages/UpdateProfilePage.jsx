"use client";

import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	AvatarBadge,
	IconButton,
	Center,
	useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast"; 

export default function UpdateProfilePage() {
    const[user , setUser]= useRecoilState(userAtom);
	console.log("user details in updateprofile" , user);
    const [inputs , setInputs]=useState({
		
        // name:user.user.name,
		name:user.name,
        username:user.username,
        email:user.email,
        password:"",
        bio:user.bio

    });
    const fileRef=useRef(null);
	const showToast= useShowToast();
    // getting this from  usePreviewIMg hooks for displaying and updating picture
    const { handleImageChange , imgUrl}=usePreviewImg();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log("user data in updateprofilepage inside handlesubmit" ,user);
        console.log("userid in UpdateProfile page inside handlesubmit" ,user._id);
		// console.log("user_id in updae profile page" , user._id)
        // console.log("user_id" ,user.user._id);
        // console.log( "complete url",`/api/users/update/${user.user._id}`);

        try {
            const res= await fetch(`/api/users/update/${user._id}`,{
             method: "PUT",
             headers:{
                "Content-Type":"application/json",

             },
             body:JSON.stringify({...inputs, profilePic:imgUrl
            }) ,
          



               })
               const data= await res.json()
               console.log(data);
			   if(data.error)
			   {
				showToast("Error" , data.error , "error");
				return;
			   }
			   showToast("Success" , "Profile updated successfully" , "success");
			   setUser(data);
			   localStorage.setItem("user-threads" , JSON.stringify(data));
            
        } catch (error) {
            useShowToast("Error" ,error ,"error")
            
        }
    }
	return (
        <form onSubmit={handleSubmit}>
		<Flex
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"md"}
				bg={useColorModeValue("white", "gray.light")}
				rounded={"xl"}
				boxShadow={"lg"}
				p={6}
				my={6}>
				<Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
					User Profile Edit
				</Heading>
				<FormControl id="userName">
					<Stack direction={["column", "row"]} spacing={6}>
						<Center>
							<Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic}></Avatar>
						</Center> 
						<Center w="full">
							<Button w="full" onClick={()=>fileRef.current.click() }>Change Avatar
                            
                            
                            </Button>
                            <Input type="file" hidden  ref={fileRef} onChange={handleImageChange}/>
						</Center>
					</Stack>
				</FormControl>
				<FormControl  >
					<FormLabel>Full name</FormLabel>
					<Input
						placeholder="FullName"
						_placeholder={{ color: "gray.500" }}
						type="text"
                        value={inputs.name}
                        onChange={(e)=>setInputs({...inputs  , name:e.target.value})}
					/>
				</FormControl>
                <FormControl  >
					<FormLabel>User name</FormLabel>
					<Input
						placeholder="UserName"
						_placeholder={{ color: "gray.500" }}
						type="text"
                        value={inputs.username}
                        onChange={(e)=>setInputs({...inputs  , username:e.target.value})}
					/>
				</FormControl>
                <FormControl >
					<FormLabel>Bio </FormLabel>
					<Input
						placeholder="Something about yourself ..."
						_placeholder={{ color: "gray.500" }}
						type="text"
                        value={inputs.bio}
                        onChange={(e)=>setInputs({...inputs  , bio:e.target.value})}
					/>
				</FormControl>
                
				<FormControl id="email" >
					<FormLabel>Email address</FormLabel>
					<Input
						placeholder="your-email@example.com"
						_placeholder={{ color: "gray.500" }}
						type="email"
                        value={inputs.email}
                        onChange={(e)=>setInputs({...inputs  , email:e.target.value})}
					/>
				</FormControl>
				<FormControl id="password" >
					<FormLabel>Password</FormLabel>
					<Input
						placeholder="password"
						_placeholder={{ color: "gray.500" }}
						type="password"
                        value={inputs.password}
                        onChange={(e)=>setInputs({...inputs  , password:e.target.value})}
					/>
				</FormControl>
				<Stack spacing={6} direction={["column", "row"]}>
					<Button
						bg={"red.400"}
						color={"white"}
						w="full"
						_hover={{
							bg: "red.500",
						}}>
						Cancel
					</Button>
					<Button
						bg={"green.400"}
						color={"white"}
						w="full"
						_hover={{
							bg: "green.500",
						}}
                         type="submit">
						Submit
					</Button>
				</Stack>
			</Stack>
		</Flex>
        </form>
	);
}
