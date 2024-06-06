
import {Flex,Avatar,Button,Text,Box} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";


const SuggestedUser = ({user}) => {
  
  const{handlefollowUnfollow,updating,following}=useFollowUnfollow(user)


  return (
  <Flex gap={2} justifyContent={"space-between"}  alignItems={"center"}>

    {/* left side */}
    <Flex gap={2} as={Link} to={`${user.username}`}>
       <Avatar src={user.profilePic}/>
       

       <Box>
        <Text fontSize={"sm"} fontWeight={"bold"}>
          {user.username}
          
        </Text>
        <Text color={"gray.light"} fontSize={"sm"}>
               {user.name}
              
        </Text>
       </Box>
    </Flex>


    {/* right side */}
    <Button size={"sm"} 
    color={following ?"black" :"white"}
    bg={following? "white" : "blue.400"}
     onClick={handlefollowUnfollow}
    isLoading={updating}
    _hover={{
      color:following?"black":"white",
      opacity:".8",
    }}
    >
      {following?"Unfollow":"follow"}
    </Button>

  </Flex>
  );
}

export default SuggestedUser
