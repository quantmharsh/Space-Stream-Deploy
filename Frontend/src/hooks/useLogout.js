import React from 'react'
import useShowToast from './useShowToast';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const useLogout = () => {
  
        const setUser= useSetRecoilState(userAtom)
        const showToast=  useShowToast();  
        const navigate = useNavigate(); 
    
        const logout=async()=>{
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
        return logout;
}

export default useLogout