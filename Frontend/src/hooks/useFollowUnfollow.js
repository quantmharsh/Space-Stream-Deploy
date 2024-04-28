import React, { useState } from 'react'
import useShowToast from "./useShowToast";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
const useFollowUnfollow = (user) => {
    
    const showToast = useShowToast();
	const currentUser = useRecoilValue(userAtom);

	const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
    const[updating , setUpdating]=useState(false);

    const handleFollowUnfollow = async () => {
        if(!currentUser)
        {
            showToast("error" ,"Please login to follow" ,"error")
            return;
        }
        if (updating) return;
        setUpdating(true)
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				showToast("error", data.error, "error");
                
				return;
			}
			if (following) {
				showToast("success", `Unfollowed ${user.name}`, "success");

				   user.followers.pop();
				   
				
			} else {
				showToast("success", `Followed ${user.name}`, "success");
				// console.log();
				// console.log("currentUser.user._id", currentUser.user._id);
				// console.log(" after user follows", user.followers);
				user.followers.push(currentUser?._id);

			}

			setFollowing(!following);
			console.log(data);
		} catch (error) {
            showToast("error" ,error ,"error")

        }finally{
            setUpdating(false);
        }
	};
  return  {handleFollowUnfollow , setUpdating , updating , following , setFollowing}
  
}

export default useFollowUnfollow