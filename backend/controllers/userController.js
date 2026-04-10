import userModel from '../models/userModel.js'

export const getData = async(req, res) => {
      
    try {
        const userId  = req.userId;
        const user = await userModel.findById(userId);
        if(!user){
            res.status(404).json({success:false, message:"user not found"});
        }
        res.status(200).json({success:true,
        userdata:{
            name:user.name,
            isAccountVerified:user.isAccountVerified
        }})
    }
    catch (error) {
        console.error("Error in getallNotes Cotroller", error);
        res.status(500).send({ msg: "Internal Server Error" });
    }
}

// User logs in → gets JWT 🍪
// Middleware verifies token → sets req.userId
// getData uses that ID
// Fetch user from DB
// Return user info