const express= require('express');
const mongoose= require('mongoose');
const url = "mongodb+srv://iamdhivyadharshini:LDejIRH6NPM5W9Rr@db1cluster.ivw0rxy.mongodb.net/"
const app= express();
const cors=require("cors");
app.use(cors({
    origin: 'http://localhost:5501/frontend/'
}));

mongoose.connect(url ,{useNewUrlParser: true});
const con= mongoose.connection;

con.on('open',() => {
    console.log('connected...');
});

app.use(express.json());


const ddrouter = require('./routers/users'); 
app.use('/users',ddrouter);

app.listen(9000, ()=>{
    console.log("Server started");
})  