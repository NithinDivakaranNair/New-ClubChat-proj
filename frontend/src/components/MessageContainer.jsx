import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import useShowToast from '../hooks/useShowToast'
import {useEffect, useRef, useState } from 'react'
import {useRecoilValue, useSetRecoilState } from 'recoil'
import {conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'

import { useSocket } from "../context/SocketContext.jsx";

import messageSound from '../assets/sounds/mixkit-long-pop-2358.wav';


 const MessageContainer = () => {

 const showToast=useShowToast();
 const selectedConversation=useRecoilValue(selectedConversationAtom);
 const[loadingMessages,setLoadingMessages]=useState(true)
 const [messages,setMessages]=useState([])
 const currentUser=useRecoilValue(userAtom)

 const {socket}=useSocket();
 const setConversations=useSetRecoilState(conversationsAtom)
 const messageEndRef=useRef(null);


 const storedUser = JSON.parse(localStorage.getItem('user-threads'));
 const token = storedUser ? storedUser.Gt : null;

   const apiBaseUrl = 'https://new-clubchat-proj.onrender.com'
  //  const apiBaseUrl = 'http://localhost:5000'


 //socket used for state management
 useEffect(()=>{
  socket.on("newMessage",(message)=>{
    if(selectedConversation._id === message.conversationId){
      setMessages((prev)=>[...prev,message]);
    }
      if(!document.hasFocus()){
        const sound=new Audio(messageSound);
        sound.play();
          }

    setConversations((prev)=>{
      const updatedConversations=prev.map((conversation)=>{
        // if(conversation._id === selectedConversation._id){
          if(conversation._id === message.conversationId){
          return{...conversation,
            lastMessage:{
              text:message.text,
              sender:message.sender
            },
          };
        }
        return conversation
      });
      return updatedConversations
    });
   });

  return ()=>socket.off("newMessage");
 },[socket,selectedConversation,setConversations])

 //scroll down the new message
 useEffect(()=>{
 messageEndRef.current?.scrollIntoView({behavior:"smooth"});
 },[messages])

//markMessageSeen
useEffect(()=>{
  const lastMessageIsOtherUser=messages.length && (messages[messages.length-1].sender !== currentUser._id);
  if(lastMessageIsOtherUser){
    socket.emit("markMessagesAsSeen",{
      conversationId:selectedConversation._id,
      userId:selectedConversation.userId
    });
  }
  socket.on("messagesSeen",({conversationId})=>{
    if(selectedConversation._id===conversationId){
      setMessages((prev)=>{
        const updatedMessages=prev.map((message)=>{
          if(!message.seen){
            return{...message,seen:true}
          }
          return message;
        })
        return updatedMessages;
      })
    }
  })
},[socket,currentUser._id,messages,selectedConversation])



 //normal state mangement
useEffect(()=>{
 const getMessages=async()=>{
   setLoadingMessages(true);
   setMessages([])
   try{
     if(selectedConversation.mock)return;
   const res=await fetch(`${apiBaseUrl}/api/messages/${selectedConversation.userId}`,
    {
    
      headers: {
     
        'Authorization': `Bearer ${token}`
       
      }
    }
   )
   const data=await res.json()
   if(data.error){
     showToast("Error",data.error,"error")
     return;
   }
   setMessages(data)
   }catch(error){
     showToast("Error",error.message,'error');
   }finally{
     setLoadingMessages(false)
   }
 }
 getMessages();
},[showToast,selectedConversation.userId,selectedConversation.mock])


  return (

    <Flex flex="70" bg={useColorModeValue("gray.200","gray.dark")}
    borderRadius={"md"} flexDirection={"column"} p={2}>
 
        { /* Message header */}
        <Flex w={"full"} h={12} alignItems={"center"} gap={2} >
            <Avatar src={selectedConversation.userProfilePic} size={"sm"}/>
            <Text display={"flex"} alignItems={"center"}>
                {selectedConversation.username}<Image src="/verified.png" w={4 } h={4} ml={1} />
            </Text>
        </Flex>
        
        <Divider/> 

     

        {/* messages */}
        <Flex flexDir={"column"} gap={4} my={4} p={2}
        height={"400px"} overflowY="auto">

      {loadingMessages && 
      [...Array(5)].map((_,i)=>(
        <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"}
        alignSelf={i%2===0 ? "flex-start":"flex-end"}> 

        { i%2 ===0 && <SkeletonCircle size={7} />}

        <Flex flexDir={"column"} gap={2}>
           <Skeleton h="8px" w="250px" />
           <Skeleton h="8px" w="250px" />
           <Skeleton h="8px" w="250px" />
           
        </Flex>
 
        { i%2 !==0 && <SkeletonCircle size={7} />}

        </Flex>
      ))
      }

      {!loadingMessages && (
        messages.map((message)=>(
          // <Message ownMessage={true}/>
          <Flex  key={message._id} direction={"column"} 
          ref={messages.length-1 === messages.indexOf(message)?messageEndRef:null }
          >          
  <Message message={message} ownMessage={currentUser._id === message.sender}/>

          </Flex>


        ))
      )}

    

        </Flex>

        {/* MessageInput */}
        <MessageInput setMessages={setMessages}/>

        </Flex>


    )
}

export default MessageContainer