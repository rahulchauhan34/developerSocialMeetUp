const express=require('express');
const connectDb=require('./config/db')
const cors = require('cors')
const app= express();

// connect db
connectDb();

//Middleware
app.use(cors());

app.use(express.json({extended:false}));
app.use(function(req, res, next) {
    req.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//define route
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


const PORT= process.env.PORT || 5000;


app.get('/', (req,res)=>res.send('API running'));

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`)
});