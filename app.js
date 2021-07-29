const express=require("express");
require('dotenv').config();
const app=express();
// const expressLayouts=require("express-ejs-layouts");
const mongoose=require("mongoose");
const PORT = process.env.PORT || 3000;
const flash=require("connect-flash");
const session=require("express-session")
const cookieParser=require("cookie-parser");
const path=require("path");
let pdf = require("html-pdf");


app.use(cookieParser())
db = require('./config/conn').MongoURI;
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then(() => {
    console.log("connection successful")
}).catch((e) => {
    console.log(e);
})


//app.use(expressLayouts)
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}))
app.use(session({
    secret: 'excusemeahmedjawed',
    resave: true,
    saveUninitialized: true
}))

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.success_msg1=req.flash("success_msg1");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash('error');
    next();
})
app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));

const staticPath=path.join(__dirname,"/public");
app.use(express.static(staticPath));


app.listen(PORT, ()=>{
    console.log("server started running")
})