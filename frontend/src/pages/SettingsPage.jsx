import { Button, Text, useShortcut } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout"



const SettingsPage = () => {

const showToast=useShowToast();
const logout =useLogout();

const storedUser = JSON.parse(localStorage.getItem('user-threads'));
const token = storedUser ? storedUser.Gt : null;

const apiBaseUrl = 'https://new-clubchat-proj.onrender.com'
// const apiBaseUrl = 'http://localhost:5000'



  const freezeAccount=async()=>{
   if(!window.confirm("Are you sure you want to freeze your account?")) return;
    try{
      const res=await fetch(`${apiBaseUrl}/api/users/freeze`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          'Authorization': `Bearer ${token}`

        },
      });
      const data=await res.json();

      if(data.error){
        return  showToast("Error",data.error,"error");
        }
      if(data.success){
        await logout()
        showToast("Success","Your account has been  frozen" ,"success");
      }
    }catch(error){
      showToast("Error",error.message ,"error");
    }
  }
  
  return (
    <>
    <Text my={1} fontWeight={"bold"}>Freeze your Account</Text>
    <Text my={1}>you can unfreeze your Account anytime by logging in.</Text>
    <Button size={"sm"} colorScheme="red"  onClick={freezeAccount}> Freze </Button>
    </>
 );
};

export default SettingsPage