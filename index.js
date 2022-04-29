const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app=express();
//port
const port=process.env.PORT||5000;

//MIDDLE WARE
app.use(cors());
app.use(express.json());

//api
app.get('/',(req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log('listening to port');
})