import  { useState } from 'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useFollowUnfollow = (user) => {
    const currentUser=useRecoilValue(userAtom)
    const [following,setFollowing]=useState(user.followers.includes(currentUser?._id));
    const [updating,setUpdating]=useState(false)
    const showToast=useShowToast();

    const storedUser = JSON.parse(localStorage.getItem('user-threads'));
    const token = storedUser ? storedUser.Gt : null;
    
    const apiBaseUrl = 'https://new-thread-proj.onrender.com'
    // const apiBaseUrl = 'http://localhost:5000'


const handlefollowUnfollow=async()=>{

    if(!currentUser){
        showToast("Error","Please login to follow","error");
        return;
        }

    if(updating) return;
    setUpdating(true)

    try{
    const res =await fetch(`${apiBaseUrl}/api/users/follow/${user._id}`,{
    method:"POST",
     headers:{
         "Content-Type":"application/json",
         'Authorization': `Bearer ${token}`
        }
     })
   const data=await res.json()
   if(data.error){
   showToast("Error",data.error,'error');
   return;
  }

 if(following){
    showToast("Success",`Followed ${user.name}`,"success");
     user.followers.pop();//simulate removing from followers
 }else{
    showToast("Success",`Unfollowed ${user.name}`,"success");
    user.followers.push(currentUser?._id);//simulate adding from followers
   }

   setFollowing(!following);
    
  }catch(error){
      showToast("Error",error,"error")
    }finally{
        setUpdating(false)
    }
}

  return {handlefollowUnfollow,updating,following}
}

export default useFollowUnfollow
