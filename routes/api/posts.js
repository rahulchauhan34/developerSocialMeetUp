const express= require('express')
const router=express.Router();
const {check,validationResult}=require('express-validator');
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const User=require('../../models/User');
const Post=require('../../models/Post');


//add route  POST api/post.  test route, public
//
router.post('/',[auth, check('text','text is required').not().isEmpty()],
async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        res.status(400).json({error:error.array()});
    }
    try {
        const user=await User.findById(req.user.id).select('-password');
    
        const newPost=new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        }); 
        const post=await newPost.save();

        res.send(post);
        } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Errors');
    }
});

module.exports=router;