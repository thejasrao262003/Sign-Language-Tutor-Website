const express = require("express");
const path = require("path");
const app = express();

require("./db/conn");
const port  = process.env.PORT || 5000;
// app.user(express.urlencoded({extended: false}))

const Register = require("C:/Users/Admin/PycharmProjects/web_techproject/web_tech_project/src/models/registers.js")

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(__dirname+'/public'))
app.get('/index', (req,res)=>{
    res.sendFile(path.join(__dirname+"/public/templates"+'/index.html'));
})

app.set("view engine", "ejs");
app.get('/main',(req,res)=>{
    res.render("page_one")
})


app.set("view engine", "ejs");
app.get('/register', (req,res)=>{
    res.render("register")
});

app.set("view engine", "ejs");
app.get('/login', (req,res)=>{
    res.render("login")
});

app.set("view engine", "ejs");
app.post('/register', async (req,res) => {
    try {
        const password = req.body.password;
        const cnf_pass = req.body.cnf_password;
        if(password===cnf_pass){
            const registerUser = new Register({
                fullname : req.body.name,
                email_address : req.body.email,
                phone : req.body.phone_number,
                password : req.body.password,
                cnf_password : req.body.cnf_password
            })

            const registered = await registerUser.save();
            app.set("view engine", "ejs");
            res.status(201).redirect("/login")
        }
        else{
            alert("Passwords are not matching")
        }
    }
    catch(error){
        res.status(400).send(error);
    }
});

//login check
app.set("view engine", "ejs");
app.post('/login', async (req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email_address:email});
        if(useremail.password === password)
        {
            res.redirect('/main');
        }
        else{
            res.send("Password are not matching");
        }

    }
    catch(error)
    {
        res.status(400).send("invalid email")
    }
});

app.set("view engine", "ejs");
app.post('/main', async(req,res)=>{
    try{
        res.redirect('http://localhost:3000/index');
    }
    catch(error){
        res.status(400).send(error);
    }
})
app.listen(port, ()=>{
    console.log("Server is running at port no: "+ port);
})