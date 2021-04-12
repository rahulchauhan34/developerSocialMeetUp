const express= require('express')
const router=express.Router();
const bcrypt=require('bcrypt');
const auth=require('../../middleware/auth')
const User=require('../../models/User')
const jwt=require('jsonwebtoken');
const config=require('config');
const {check, validationResult}=require('express-validator');
//add route  GET api/auth.  test route, public
//
router.get('/', (req,res)=>{
    try{
       // const user =  await User.findById(req.user.id).select('-password');
        console.log(res);
       // res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.send(500).send('server error');
    }
});

router.post('/',[
   
    check('email', 'please inclue a valid email').isEmail(),
    check('password','password is required').exists()
],

async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    const {  email, password}=req.body;

    
    try{
        //check if user exist
        let user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({errors:[{msg:"Invalid credential"}]});
        }

    const isMatched=await bcrypt.compare(password,user.password);
    
    if(!isMatched)
    {
        return res.status(400).json({errors:[{msg:"Invalid credential"}]});
    }



   
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