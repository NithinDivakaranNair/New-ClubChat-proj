import User from '../models/userModel.js';
import Post from '../models/postModels.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';

import{v2 as cloudinary} from "cloudinary";
import mongoose from 'mongoose';

// signupUser
const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;
        
        // Check if a user with the provided email or username already exists
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        // Save the new user to the database
        await newUser.save();
        
        // Respond with the newly created user data
        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio:newUser.bio,
                profilePic:newUser.profilePic
            });
        }else{
            res.status(400).json({error:"Invalid User data"});
        }
         } catch (err) {
        // Handle errors
        console.error('Error in signupUser:', err.message);
        res.status(500).json({ error:err.message });
    }
};


//loginUser
const loginUser=async(req,res)=>{
try{
const {username,password}=req.body
const user=await User.findOne({username});
const isPasswordCorrect=await bcrypt.compare(password,user?.password || "");

if(!user || !isPasswordCorrect){
    return res.status(400).json({error:'Invalide username or password'})
}
if(user.isFrozen){
    user.isFrozen=false;
    await user.save();
}


generateTokenAndSetCookie(user._id,res)
res.status(200).json({
    _id:user._id,
    name:user.name,
    email:user.email,
    username:user.username,
    bio:user.bio,
    profilePic:user.profilePic

})
}catch(err){
    res.status(500).json({error: err.message})
    console.error('Error in loginUser:', err.message);

}
}



//logoutUser
const logoutUser=async(req,res)=>{
   try{
   res.cookie('jwt',"",{maxAge:1});
   res.status(200).json({message:"user logout  successfully"})
   } catch(err){
    res.status(500).json({error: err.message})
    console.log('Error in logoutUser:', err.message)
   }
}

///followUnFollowUser
const followUnFollowUser=async(req,res)=>{
try{
const {id}=req.params;
const userToModify=await User.findById(id);
const currentUser=await User.findById(req.user._id);

if(id===req.user._id.toString())return res.status(400).json({error:"you cannot follow/unfollow yourself"});

if(!userToModify || !currentUser) return res.status(400).json({error:"user not found"});

const isFollowing=currentUser.following.includes(id);
if(isFollowing){
    //unfollow user
    //modify current user following,modify followers of userToModify
    await User.findByIdAndUpdate(req.user.id,{$pull:{following:id}});
    await User.findByIdAndUpdate(id,{$pull:{followers:req.user.id}})
     res.status(200).json({message:"user unfollowed successfuly"})
}else{
    //follow user
    await User.findByIdAndUpdate(req.user.id,{$push:{following:id}});
    await User.findByIdAndUpdate(id,{$push:{followers:req.user.id}}) 
    res.status(200).json({message:"user followed successfuly"})

}
}catch(err){
    res.status(500).json({error:err.message})
    console.log('error in followUnfollowUser: ',err.message)
}
}

      
//updateUserProfile
const updateUser=async(req,res)=>{ 
         const {name,email,username,password,bio}=req.body;
        let{profilePic}=req.body;
        const userId=req.user._id;
    try{
        
        let user=await User.findById(userId);
        if(!user)return res.status(400).json({error:"user not found"});
      

         if(userId.toString()!==req.params.id)
         return res.status(400).json({error:"you cannot update other user's profile"});

        if(password){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);
            user.password=hashedPassword;
        }
        
        if(profilePic){
            if(user.profilePic){// already image is existing ,that image is deleted
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]); 
            }
            const uploadedResponse=await cloudinary.uploader.upload(profilePic); //picture is upload the cloud,output is object
            profilePic=uploadedResponse.secure_url;// fetching image cloud url path in  "uploadedResponse" object
        }


        user.name=name||user.name;
        user.email=email||user.email;
        user.username=username||user.username;
        user.profilePic=profilePic||user.profilePic;
        user.bio=bio||user.bio;

       user= await  user.save();

  // Find all posts that this user replied and update username and userProfilePic fields
  await Post.updateMany(
    { "replies.userId": userId },
    {
        $set: {
            "replies.$[reply].username": user.username,
            "replies.$[reply].userProfilePic": user.profilePic,
        },
    },
    { arrayFilters: [{ "reply.userId": userId }] }
);
     
       
       //password should be null in response
            user.password=null; 

       res.status(200).json(user)

    }catch(err){
        res.status(500).json({ error:err.message });
        console.log('error in updateUser:',err.message);
    }

};

//getUserProfile
const getUserProfile=async(req,res)=>{
    // we will fetch user profile either with username  or userId
    //query is either username or userId
          const{query}=req.params;
    try{
        // const{username}=req.params;
     let user;

  if(mongoose.Types.ObjectId.isValid(query)){
    //query is userId
        user=await User.findOne({_id:query}).select("-password").select("-updatedAt");
   }else{
    // query is username
    user=await User.findOne({username:query}).select("-password").select("-updatedAt");
    }
        if(!user) return res.status(400).json({error:"user not found"})
        
         res.status(200).json(user);
    }catch(err){
        res.status(500).json({ error: err.message });
        console.log('error in updateUser:',err.message);
    }

}

//freezeAccount
const freezeAccount=async(req,res)=>{
    try{
       const user=await User.findById(req.user._id);
       if(!user){
        return res.status(400).json({error:"User not found"});
       }
       user.isFrozen=true;
       await user.save();
       return res.status(400).json({success:true})
    }catch(err){
        res.status(500).json({ error: err.message });
 
    }
}


//getSuggestedUsers
const getSuggestedUsers= async(req,res)=>{
    try{
//exclude the current user from suggested user array,exclude users that current user is already following
const userId =req.user._id;

const usersFollowedByYou=await User.findById(userId).select("following");

const users=await User.aggregate([
    {$match:{_id:{$ne:userId}}},
    {$sample:{size:10}}
])
const filteredUsers=users.filter((user)=>!usersFollowedByYou.following.includes(user._id))
const suggestedUsers=filteredUsers.slice(0,4)

suggestedUsers.forEach((user) =>(user.password=null))

res.status(200).json(suggestedUsers);

    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export { signupUser,
    loginUser,
    logoutUser,
    followUnFollowUser,
    updateUser,
    getUserProfile,
    freezeAccount,
    getSuggestedUsers
};
