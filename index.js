const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

// EndPoint
app.get('/', (req,res)=>{
    res.send('tag Server is Running')
})


app.listen(port, ()=>{
    console.log(`hey dev! your Server is runing on port ${port}`);
})