import { Flex, Image, Link, useColorMode , Button } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink} from 'react-router-dom';
import {AiFillHome} from "react-icons/ai"
import {RxAvatar} from "react-icons/rx"
import {FiLogOut} from  "react-icons/fi"
import useLogout from '../hooks/useLogout';
import  {BsFillChatQuoteFill} from "react-icons/bs"
import {MdOutlineSettings} from "react-icons/md"
const Header = () => {
    // it is hoook provided by chakra ui for changing color 
     const{colorMode , toggleColorMode } =useColorMode();
     
     const user= useRecoilValue(userAtom);
     const logout= useLogout();
     console.log("user in Heade.jsx " , user);
  return (
    <div>
        <Flex justifyContent={"space-between"} mt={6} mb='12'>
          {user &&(
            <Link as ={RouterLink} to ="/"> 
              <AiFillHome size={24}/>
            </Link>
          )}
            <Image
             cursor={"pointer"}
             alt="logo"
             width={6}
             src={colorMode==="dark"?"/light-logo.svg":"/dark-logo.svg"}
             onClick={toggleColorMode}

            />
            {user &&(

            //  changed here user.user.username
            <Flex alignItems={"center"} gap={4}> 
            <Link as ={RouterLink} to = {`/${user.username}`}>
              <RxAvatar size={24}/>
            </Link>
            <Link as ={RouterLink} to = {`/chat`}>
              <BsFillChatQuoteFill size={20}/>
            </Link>
            {/* step 1 add link to go to settings (next step in app) */}
            <Link as ={RouterLink} to = {`/settings`}>
              <MdOutlineSettings size={20}/>
            </Link>
            <Button  size={"xs"} onClick={logout} > 
 <FiLogOut  size={20}/> </Button>
            </Flex>
          )}

        </Flex>
    </div>
  )
}
 
export default Header