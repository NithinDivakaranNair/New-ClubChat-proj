import Post from '../models/postModels.js'
import User from '../models/userModel.js'
import  {v2 as cloudinary} from 'cloudinary'

const createPost=async(req,res)=>{
try{
    const {postedBy,text}=req.body;
    let {img}=req.body;

    if(!postedBy||!text){
        return res.status(400).json({error:"postedBy and text fields are required"})
    }

    const user=await User.findById(postedBy);//--find user getting by "PostedBy" user value;

    if(!user){
        return res.status(404).json({error:"user not found"});
    }

    if(user._id.toString()!==req.user._id.toString()){     // "toString()"  its used 
    return res.status(401).json({error:"unautherized to create user"});
    }

    const maxLength=500;
    if(text.length>maxLength){
        return res.status(400).json({error:`text must be less than ${maxLength} characters `})
    }
    if(img){
        const uploadedResponse=await cloudinary.uploader.upload(img)
        img=uploadedResponse.secure_url;
    }
    
    const newPost=new Post ({postedBy,text,img})
    await newPost.save();
    res.status(201).json(newPost)

   }catch(err){ 
    res.status(500).json({ error: err.message });
    console.log(err)
}
}


//getpost
const getPost=async(req,res)=>{
try{
 const post=await Post.findById(req.params.id) //"req.params.id"=selecting userId,"post"=that current user all posts

 if(!post){
    return res.status(404).json({error:"post not found"})
 }
 res.status(201).json(post) //post is object
}catch(err){
    res.status(500).json({ error: err.message  });
    console.log(err)   
}
}

//deletepost

const deletePost=async(req,res)=>{
    try{
const post=await Post.findById(req.params.id) //current postId
if(!post){
    return res.status(404).json({error:"post not found"})
}
if(post.postedBy.toString()!==req.user._id.toString()){
    return res.status(401).json({error:"unauthoried to delete post"})
}
if(post.img){ 
    const imgId=post.img.split("/").pop().split(".")[0]; 
    // example :(https://res.cloudinary.com/dl2glgwiz/image/upload/v1711118180/mebjfacjq4mywugx3xff.jpg)
    //post.img.split("/"):["https:", "", "res.cloudinary.com", "dl2glgwiz", "image", "upload", "v1711118180", "mebjfacjq4mywugx3xff.jpg"]
    //.pop().split("."): ["mebjfacjq4mywugx3xff", "jpg"]
    //[0]:mebjfacjq4mywugx3xff
    await cloudinary.uploader.destroy(imgId) // delete image in cloudinary
}

await Post.findByIdAndDelete(req.params.id); //current postId delete
res.status(200).json({message:"Post delete  successfully"})

}catch(err){
    res.status(500).json({ error: err.message });
    console.log(err)
}
}

//likeUnlikePost
const likeUnlikePost=async(req,res)=>{
try{
    
    const{id:postId}=req.params;//output:{ id: '65fca61f196ee4455723f1d1' } this postid
    const userId=req.user._id;
    const post=await Post.findById(postId);
    if(!post){
        return res.status(404).json({error:"post not found"});
    }

    const userLikePost=post.likes.includes(userId);//checking  the "userid" post like- array 
    if(userLikePost){
        //Unlike post
        await Post.updateOne({_id:postId},{$pull:{likes:userId}});
        res.status(200).json({message:"Post unliked successfully"})
    }else{
        //like post
        post.likes.push(userId);
        await post.save();
        res.status(200).json({message:"Post liked successfully"})
    }

}catch(err){
    res.status(500).json({ error: err.message });
    console.log(err)
}
}

//replyToPost
const replyToPost=async(req,res)=>{
try{
    const {text}=req.body;
    const postId=req.params.id;
    const userId=req.user._id;
//this "req.user._id" getting for token
//"req.user"= {
//   _id: new ObjectId('65ed9e116f48b0427680250c'),
//   name: 'nithin007',
//   username: 'nithin001',
//   email: 'nithin@gmail.com',
//   profilePic: 'https://res.cloudinary.com/dl2glgwiz/image/upload/v1711028730/oasbpvfcy2knhmwqkzzm.jpg',
//   followers: [],
//   following: [
//     '65eebf6fd65370bfb9aa81c5',
//     '65edfee9304758d5385a2b4e',
//     '65edd1dd5d932b7d5fac0dd6'
//   ],
//   bio: 'vcnvnvdfcvxvxzcv',
//   createdAt: 2024-03-10T11:48:33.710Z,
//   updatedAt: 2024-03-21T14:57:46.214Z,
//   __v: 0
// }
    const userProfilePic=req.user.profilePic;
    const username=req.user.username;
    if(!text){
        return res.status(400).json({error:"text field is required"})
    }
    const post=await Post.findById(postId); //getting post based on "postId"
    if(!post){
        return res.status(404).json({error:"post not found"})
    }
   const reply={userId,text,userProfilePic,username};
   post.replies.push(reply);
   await post.save();
   res.status(200).json(reply);

}catch(err){
    res.status(500).json({ error: err.message });
    console.log(err)
}
}

//getFeedPosts

const getFeedPosts=async(req,res)=>{
  try{
    const userId=req.user._id;
    const user=await User.findById(userId)
     if(!user){
        return res.status(404).json({error:'user not found'});

     }
     const following=user.following;//getting following user
     const  feedPost=await Post.find({postedBy:{$in:following}}).sort({createdAt:-1});//getting posts on "following" user
     res.status(200).json(feedPost)

  }catch(err){
    res.status(500).json({ error: err.message });
    console.log(err)
  }
       
}


//getUserPosts

const getUserPosts=async(req,res)=>{
  const {username}=req.params;
  try{
    const user=await User.findOne({username})
    if(!user)return res.status(404).json({error:"User not found"});
    const posts =await Post.find({postedBy:user._id}).sort({createdAt:-1});
    res.status(200).json(posts);
  }catch(error){
    res.status(500).json({error:error.message});
  }
}


export {createPost,
        getPost,
        deletePost, 
        likeUnlikePost,
        replyToPost,
        getFeedPosts,
        getUserPosts   };