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


//add route  GET api/post.  test route, public
//
router.get('/',auth,
async (req,res)=>{
    
    try {
        const posts=await Post.find().sort({date:-1});
        res.json(posts);

        } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Errors');
    }
});



//add route  GET api/post/:id.  test route, public
//
router.get('/:id',auth,
async (req,res)=>{
    
    try {
        const post=await Post.findById(req.params.id);
        if(!post)
        {
            res.status(500).send('Post Not found');
        }
        res.json(post);

        } catch (error) {
        console.error(error.message);
        if(error.kind==='ObjectId')
        {
            res.status(500).send('Post Not found');
        }
        res.status(500).send('Server Errors');
    }
});




//add route  DELETE api/post.  test route, public
//
router.delete('/:id',auth,
async (req,res)=>{
    
    try {
        const post=await Post.findById(req.params.id);
        if(post.user.toString() !==req.user.id)
        {
            res.status(401).json({msg:'User not Authorized'});
        }

        await post.remove();

        res.json(post);

        } catch (error) {
        console.error(error.message);
        if(error.kind==='ObjectId')
        {
            res.status(500).send('Post Not found');
        }
        res.status(500).send('Server Errors');
    }
});

//PUT request for api/posts/like/:id

router.put('/like/:id',auth,async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        if
        (
            post.likes.filter(like=>like.user.toString()==req.user.id).length>0
        )
        {
            return res.status(400).json({msg:"Post already liked"});
        }

        post.likes.unshift({user:req.user.id});

       await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(error.message);
        if(error.kind==='ObjectId')
        {
            res.status(500).send('Post Not found');
        }
        res.status(500).send('Server Errors');
    }
})


//PUT request for api/posts/unlike/:id

router.put('/unlike/:id',auth,async (req,res)=>{
    try {
        const post=await Post.findById(req.params.id);

        if
        (
            post.likes.filter(like=>like.user.toString()==req.user.id).length===0
        )
        {
            return res.status(400).json({msg:"Post has not been liked"});
        }

     //get remove index
     const removeLike=post.likes.indexOf(req.user.id);

     post.likes.splice(removeLike,1);
       await post.save();
        res.json(post);
    } catch (err) {
        console.error(error.message);
        if(error.kind==='ObjectId')
        {
            res.status(500).send('Post Not found');
        }
        res.status(500).send('Server Errors');
    }
})


//add route  POST api/posts/comment/:id.  test route, public
//
router.post('/comment/:id',[auth, check('text','text is required').not().isEmpty()],
async (req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        res.status(400).json({error:error.array()});
    }
    try {
        
        const user=await User.findById(req.user.id).select('-password');
        const post=await Post.findById(req.params.id);

        const newComment={
            text:req.body.text,
           name:user.name,
            user:req.user.id,
            avatar:user.avatar
            
        }; 

        post.comments.unshift(newComment);

       await post.save();

        res.send(post);
        } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Errors');
    }
});


//DELETE request for api/posts/comments/:id/:comment_id

router.delete('/comments/:id/:comment_id',auth,async (req,res)=>{
try {

    const post=await Post.findById(req.params.id);
    const comment=post.comments.find(comment=>comment.id===req.params.comment_id);

    if(!comment)
    {
        return res.status(404).json({msg:'comment not present'});
    }
    if(comment.user.toString()!==req.user.id)
    {
        return res.status(404).json({msg:'user not authorizeds'});
    }
    const removeIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user.id);
    post.comments.splice(removeIndex,1);
    post.save();
    res.json(post);
} catch (error) {
    console.error(error.message);
        res.status(500).send('Server Errors');
}
}
);





module.exports=router;