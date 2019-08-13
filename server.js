const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const knex=require('knex');
const bcrypt = require('bcryptjs');
const app=express();

const db=knex({
    client:'pg',
    connection:{
        host:'127.0.0.1',
        user:'postgres',
        password:'Angelo2001',
        database:'markup-doc-db'
    }
});
//middleware
app.use(bodyParser.json());
app.use(cors());

//request/response
app.get("/:cat/:recent",(req,res)=>{
    console.log(req.params)
    if(req.params.recent==="recent"){
        db.select('category', 'domain', 'question', 'answer', 'date', 'name').from("qna").join("users", 'users.email', '=', 'qna.email').where({ category: req.params.cat }).orderBy('date','desc')
            .then(qna => res.json(qna))
            .catch(err => res.json('something went wrong'))
    }else{
    db.select('category','domain','question','answer','date','name').from("qna").join("users",'users.email','=','qna.email').where({category:req.params.cat})
    .then(qna=>res.json(qna))
    .catch(err=>res.json('something went wrong'))
    }
})

app.post("/signin",(req,res)=>{
    let {email,password}=req.body;
   db.select("*").from("login").where("email","=",email)
   .then(user=>{
       let isValid=bcrypt.compareSync(password,user[0].hash);
       if(isValid){
           return db.select("*").from("users").where("email","=",email)
                    .then(user=>res.json(user[0]))
                    .catch(err=>res.status(400).json("wrong credentials"))
       }else{
           return res.status(400).json("wrong credentials");
       }
   })
   .catch(err=>res.json("wrong credentials"))
})

app.post("/register",(req,res)=>{
let {name,email,password}=req.body;
let hash=bcrypt.hashSync(password);
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=>{
            return trx('users')
            .insert({
                name: name.toLowerCase(),
                email: loginEmail[0],
                joined: new Date()
           })
            .returning("*")
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register"));
})

app.get("/search",(req,res)=>{
    let {searchField}=req.body;
    res.json("searching...")
})

app.post("/add",(req,res)=>{
    let  {category,domain,question,answer,email,tags,date}=req.body;
    tags = tags.reduce((acc, el) => { return acc + "," + el }, "").replace(',', "");
    db.insert({
        category, domain, question, answer, email, date, tags
    }).into("qna")
    .returning("*")
    .then(qna => res.json("added"))
    .catch(err=>res.status(400).json("unable to add"))
   
})

app.listen(3001,()=>{
    console.log("app is running on port 3001")
})