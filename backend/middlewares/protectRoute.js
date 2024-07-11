// import User from '../models/userModel.js'
// import jwt from 'jsonwebtoken' 

// const protectRoute=async(req,res,next)=>{
// try{
//     const token=req.cookies.jwt;
//     if(!token)return res.status(401).json({message:"Unautherized"})

//     const decoded=jwt.verify(token,process.env.JWT_SECRET);

//     const user=await User.findById(decoded.userId).select("-password");

//     req.user=user;

//     next();
// }catch(err){
//     res.status(500).json({message:err.message});
//     console.log('Error in signupUser:',err.message)
// }
// }

// export default protectRoute




import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const protectRoute = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.header('authorization'); // or req.headers['authorization']
  
  if (authHeader) {
    const [bearer, token] = authHeader.split(' ');
    if (bearer === 'Bearer' && token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user based on the decoded user ID
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          return res.status(404).send('User not found');
        }

        // Attach the user to the request object
        req.user = user;

        // Continue to the next middleware or route handler
        next();
      } catch (error) {
        // Handle errors (invalid token, expired token, etc.)
        res.status(401).send('Unauthorized: Token is invalid or expired');
      }
    } else {
      res.status(401).send('Unauthorized: Invalid token format');
    }
  } else {
    res.status(401).send('Unauthorized: No token provided');
  }
};

export default protectRoute;
