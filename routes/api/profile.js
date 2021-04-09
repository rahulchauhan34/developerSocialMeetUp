const express= require('express')
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const User=require('../../models/User');
const {check,validationResult}=require('express-validator');
//add route  GET api/profile/me. 
//get current user test route, public
// private


router.get('/me',auth, async (req,res)=>
{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile)
        {
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server eror');
    }
}
);

//this is a post request create or update a profile


router.post('/',[auth,
                [check('status','status is required').not().isEmpty(),
                check('skills','skill is required').not().isEmpty()]],
                 async (req,res)=>{
                    const error=validationResult(req);
                   if(!error.isEmpty())
                   {
                        return res.status(400).json({error:error.array()});
                   }
                  
                  // destructure the request
    const {
        company,
        website,
        skills,location,bio,status,githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;
      // build profile object
      const profileFields={};
      profileFields.user=req.user.id;
      if(company) profileFields.company=company;
      if(website) profileFields.website=website;
      if(bio) profileFields.bio=bio;
      if(status) profileFields.status=status;
      if(githubusername) profileFields.githubusername=githubusername;
      if(skills) {
        profileFields.skills=skills.split(",").map(skill=>skill.trim());
      }
      
      //build social array
      profileFields.social = {};
      if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
      if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
      if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
      if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
      if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

      try{
          let profile= await Profile.findOne({user:req.user.id});
          if(profile)
          {
              //update
            profile=await Profile.findOneAndUpdate({user:req.user.id}, {$set:profileFields},{new:true});
            return res.json(profile);
        }
         // create
         profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);
      }
      catch(err){
console.error(err.message);
res.status(500).send('Server error');
      }

 }
);

//get all the profile

router.get('/',async (req,res)=>{

try{
    const profiles=  await Profile.find().populate('user',['name','avatar']);
    res.json(profiles);
}
catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
              }

})

//add route  GET api/profile/from user id. 
//get profile by user id
// private


router.get('/user/:user_id', async (req,res)=>
{
    try{
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile)
        {
            return res.status(400).json({msg:'There is no profile for this user'})
        }
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        if (err.kind=='ObjectId'){return res.status(400).json({msg:'There is no profile for this user'})}
        res.status(500).send('Server error');
    }
}
);



//add route  DELETE api/profile/from user id. 
//delete profile and user and post
// private


router.delete('/', auth,async (req,res)=>
{
    try{
        //to-do also remove user post
        //remove the profile
        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id:req.user.id});

        res.json({msg:"User and profile attached to it has been deleted"});
    }
    catch(err){
        console.error(err.message);
        if (err.kind=='ObjectId'){return res.status(400).json({msg:'There is no profile for this user'})}
        res.status(500).send('Server error');
    }
}
);



//add route  PUT api/profile/from user id. 
//PUT  add profile experience
// private


router.put('/experience',[auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','company is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty()
]] ,async (req,res)=>
{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(500).json({errors:error.array()});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } =req.body;
    const newexp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try{
        const profile=await Profile.findOne({user:req.user.id});

        profile.experience.unshift(newexp);

        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }

}
);

//add route  DELETE api/profile/from user id. 
//delete profile experience
// private


router.delete('/experience/:exp_id', auth,async (req,res)=>
{  
try{
   const profile= await Profile.findOne({user:req.user.id});

   //get the remove index
   const removeindex= profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeindex,1);

   await profile.save();
 res.json(profile);
}
  catch(err){
    console.error(err.message);
    res.status(500).send('server error')
}
}
);




//add route  PUT api/profile/from user id. 
//PUT  add profile education 
// private


router.put('/education',[auth,[
    check('school','School is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
    check('degree','degree  is required').not().isEmpty(),
    check('from','from  is required').not().isEmpty()
]] ,async (req,res)=>
{
    const error=validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(500).json({errors:error.array()});
    }
    const {
        school,
        fieldofstudy,
        degree,
        from,
        to,
        current,
        description
    } =req.body;
    const newexp={
        school,
        fieldofstudy,
        degree,
        from,
        to,
        current,
        description
    };

    try{
        const profile=await Profile.findOne({user:req.user.id});

        profile.education.unshift(newexp);

        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('server error')
    }

}
);


//add route  DELETE api/profile/from user id. 
//delete profile educattion
// private


router.delete('/education/:edu_id', auth,async (req,res)=>
{  
try{
  const profile=await Profile.findOne({user:req.user.id});
  const removeindex= profile.education.map(item=>item._id).indexOf(req.params.edu_id);

  profile.education.splice(removeindex,1);

    await profile.save();
   res.json(profile);
}
  catch(err){
    console.error(err.message);
    res.status(500).send('server error')
}
}
);
module.exports=router;