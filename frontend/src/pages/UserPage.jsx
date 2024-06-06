import { useEffect, useState } from "react";
import UserHeder from "../components/UserHeder"
import { useParams } from "react-router-dom"
import useShowToast from "../hooks/useShowToast";
// import UserPost from "../components/UserPost"
import {  Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  // const[user,setUser]=useState(null)
  // const [loading,setLoading]=useState(true)

  const{user,loading}=useGetUserProfile(); //Getting User
    const{username}=useParams();
    const showToast=useShowToast();
    //getting post 
    const[posts,setPosts]=useRecoilState(postsAtom)
   const[fetchingPosts,setFetchingPosts]=useState(true)

  useEffect(()=>{
//Getting User
 //Getting Posts   
     const getPosts=async()=>{

      if(!user)return;//user is freeze

      setFetchingPosts(true);
   try{
    const res=await fetch(`/api/posts/user/${username}`);
    const data=await res.json();
    setPosts(data)
      }catch(error){
        showToast("Error",error.message,"error")
        setPosts([])
      }finally{
        setFetchingPosts(false)
      }
       }
   getPosts();
   },[username,showToast,setPosts,user])


if(!user && loading){
  return(
    <Flex justifyContent={"center"}>
    <Spinner size={"xl"} />
    </Flex>
  )
}


if(!user && !loading){
return <h1>User not found</h1>
}

  return (
    <>
      <UserHeder user={user}/>

    { !fetchingPosts&& posts.length===0&&<h1>user has not posts</h1>}
    {fetchingPosts&&(
       <Flex justifyContent={"center"} my={12}>
       <Spinner size={"xl"} />
       </Flex>
     )}

 {posts.map((post)=>(
  <Post key={post._id} post={post} postedBy={post.postedBy}  />
 ))}


 {/* <UserPost like={1200} replies={481} postImg="/post1.png" postTitle='lets talk abbout threads'/>
 <UserPost like={451} replies={12} postImg="/post2.png" postTitle='Nice tutorial'/>
 <UserPost like={321} replies={982} postImg="/post3.png" postTitle='i love u'/>
 <UserPost like={212} replies={56}  postTitle='Nice tutorial'/> */}
 
    </>
  )
}

export default UserPage
