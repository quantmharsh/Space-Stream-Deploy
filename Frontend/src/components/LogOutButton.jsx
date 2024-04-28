import { Button } from '@chakra-ui/react'
import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import { useNavigate } from 'react-router-dom'; 
import {FiLogOut} from  "react-icons/fi"

const LogOutButton = () => {
    const setUser= useSetRecoilState(userAtom)
    const showToast=  useShowToast();  
    const navigate = useNavigate(); 

    const handleLogout=async()=>{
        console.log("logout clicked")
        try {
           
            const res=  await fetch("/api/users/logout", {
                method:"POST",
                headers:{
                 "Content-Type":"application/json"
                },
            })
            const data = await res.json();
            console.log(data);
            if(data.message)
            {
               showToast("Error" ,data.message , "error")
              
            }
            localStorage.removeItem("user-threads");
            setUser(null);
            navigate('/auth');

        } catch (error) {
           console.log("error while handling logout" , error);
            
        }
    }
  return (
<Button position={"fixed"} top={"30px"} right={"30px"} size={"sm"} onClick={handleLogout} > 
 <FiLogOut  size={20}/> </Button>
  )
}

export default LogOutButton