const express=require('express');
const app=express();
const bodyParser=require('body-parser');

const db={
    users:[
        {
            id:001,
            name:"John Doe",
            email:"johndoe@yahoo.com",
            password:"johndoe",
            joined:new Date(),
        },
        {
            id: 002,
            name: "Ann Marie",
            email: "annmarie@yahoo.com",
            password: "annmarie",
            joined: new Date(),
        },
        {
            id: 003,
            name: "Sally Dowson",
            email: "sallydowson@yahoo.com",
            password: "sallydowson",
            joined: new Date(),
        },
    ]
}

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.json(db.users)
})

app.get("/signin",(req,res)=>{
    let {email,password}=req.body;
   if(email===db.users[0].email && password===db.users[0].password){
       res.json("successful signin");
    }else{
           res.json("wrong credentials")
    }
    
})

app.post("/register",(req,res)=>{
const {name,email,password}=req.body
    db.users.push({
        id:004,
        name:name,
        email:email,
        password:password,
        joined:new Date(),
    });
        res.json("registered");
})

app.get("/search",(req,res)=>{
    let {searchField}=req.body;
    res.json("searching...")
})




app.listen(3001,()=>{
    console.log("app is running on port 3001")
})