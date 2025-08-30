const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected MongoDB"));


app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port 3000");
})

app.get('/', (req, res)=>{
    res.send("Hello World");
});