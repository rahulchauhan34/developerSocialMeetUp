const express= require('express')
const router=express.Router();
const {check, validationResult}=require('express-validator');
const User=require('../../models/User');
const bcrypt=require('bcrypt');
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const config=require('config');

//add route  POST api/user. register user, public
//

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email', 'please inclue a valid email').isEmail(),
    check('password','please enter a password with 6 or more character').isLength({min:6})
],

async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    const {name , email, password}=req.body;

    
    try{
        //check if user exist
        let user=await User.findOne({email});
        if(user)
        {
            return res.status(400).json({errors:[{msg:"user alereay exist"}]});
        }


    // get the avatar
        const avatar=gravatar.url(email,
            {
                s:'200',
                r:'pg',
                d:'mm'
            })
        user =new User({
            name,
            email,
            avatar,
            password
        })
    //encrypt password
        const salt= await bcrypt.genSalt(10);
        user.password=await bcrypt.hashSync(password,salt);

        await user.save();//saving to db
    //send jwt token for login
        const payload={
            user:{
                id:user.id
            }
        }    
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:36000},
        
        (err, token)=>{
            if(err) throw err;
            res.json({token});
        });

    }catch(err){

        console.error(error.message);
        res.status(500).send('server error')
    }
     
    }
);

module.exports=router;