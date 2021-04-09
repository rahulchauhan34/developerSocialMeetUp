const mongoose=require('mongoose');
const config=require('config');
const db= config.get('mongoURI');

const connectDb= async ()=>{
    try{
         await mongoose.connect(db, { useNewUrlParser: true , 
             useUnifiedTopology: true, 
             useCreateIndex:true ,
             useFindAndModify:false});
         console.log("mongo db is connected...")   
    }catch(err)
    {
        console.log(`mongo db is not connected due to ${err.message}`)  
        process.exit(1);
    }
}

module.exports=connectDb;

