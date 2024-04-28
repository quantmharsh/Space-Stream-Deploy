import { Button, Text } from '@chakra-ui/react'
import React from 'react'
import useShowToast from '../hooks/useShowToast'
import useLogout from "../hooks/useLogout"
const SettingsPage = () => {
    const showToast= useShowToast();
    const logOut= useLogout();
    // step 5
    const freezeAccount=async()=>{
        if(!window.confirm("Are you sure you want to freeze your account 😟")) return;
        

        try {

          const res= await fetch("/api/users/freeze" ,
          {
         method:"PUT",
          headers:{
            "Content-Type":"application/json"
          }
          }
        )
        const data= await res.json();
        if(data.error)
        {
          return showToast("error" , data.error ,"error")
        }
        if(data.success)
        {
          await  logOut();
          showToast("success", "Account frozen successfully" ,"success")
        }

            
        } catch (error) {
            showToast("error" , error.message , "error")
            
        }

    }
  return (
    <>
    <Text my={1} fontWeight={"bold"}>Freeze your Account </Text>
    <Text  my={1}> You can unfreeze your account anytime just by logging in.</Text>
    <Button colorScheme='red' size={"sm"} onClick={freezeAccount}> Freeze 🔐</Button>
    
    </>
  )
}

export default SettingsPage