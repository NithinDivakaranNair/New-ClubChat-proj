import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";


const apiBaseUrl = 'https://new-clubchat-proj.onrender.com'


const useLogout = () => {
    const setUser=useSetRecoilState(userAtom);
    const showToast=useShowToast();

    const logout=async()=>{
        try{
     //fetch
     const res=await fetch(`${apiBaseUrl}/api/users/logout`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
     })
     const data=await res.json()
     if(data.error){
        showToast("Error",data.error,"error")
        return;
     }

     localStorage.removeItem("user-threads");
     setUser(null)
    
        }catch(error){
            showToast("Error",error,"error")
        }
    };

    return logout;
}

export default useLogout;