const express = require("express");
const router = express.Router();
const Userdetail = require("../models/Userdetail")
const Portfoliodetail = require("../models/portfoliodetail")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
require('dotenv').config();
const auth = require("../config/auth");
const cookieParser = require("cookie-parser");
let pdf = require("html-pdf");
let path = require("path");
let ejs = require("ejs");

router.use(cookieParser())
router.get("/register", (req, res) => {
    res.render("register");
})
router.get("/login", (req, res) => {
    res.render("login");
})
router.post("/register", (req, res) => {
    const { name, email, phone, course, branch, year, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !phone || !course || !branch || !year || !password || !password2) {
        errors.push({ msg: "fill all the details" })
    }
    if (password !== password2) {
        errors.push({ msg: "password not matching" })
    }
    if (password.length < 6) {
        errors.push({ msg: "password should be atleast 6 characters" })
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            phone,
            course,
            branch,
            year,
            password,
            password2
        })
    } else {
        Userdetail.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: "email is already present" })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        phone,
                        course,
                        branch,
                        year,
                        password,
                        password2
                    })
                } else {
                    const newUser = new Userdetail({
                        name: name,
                        email: email,
                        phone:phone,
                        course:course,
                        branch:branch,
                        year:year,
                        password: password
                    })
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'registered successfully and can login')
                            res.redirect("/users/login");
                        }).catch(err => console.log(err));

                }
            })
    }
})
router.get("/:id/portfolioform/:id/edit", auth, (req,res)=>{
    const {id} = req.params;
    Portfoliodetail.findOne({_id : id})
    .then(user=>{
        Userdetail.findOne({email:user.orgemail})
        .then(user2=>{
            res.render("edit",{user, user2})
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})
router.post("/:id/portfolioform/:id/edit", auth, async(req,res)=>{
    const {id}=req.params
    const { name, role1, role2, role3, about, skill1, skill2, skill3, skill4, skill5, rate1,
    rate2, rate3, rate4, rate5, schoolname, schoolyearjoin, schoolyearleft, 
    collegename, collegeyearjoin, collegeyearleft, coursename, universityname, universityyearjoin, 
    universityyearleft, emailport, numberport, linkedinport, githubport, instaport } = await req.body
    const update= await Portfoliodetail.updateMany({_id:id}, { $set: {name, role:[{role1, role2, role3}], about, skill1, skill2, skill3, skill4, skill5, rate1,
        rate2, rate3, rate4, rate5, schoolname, schoolyearjoin, schoolyearleft, 
        collegename, collegeyearjoin, collegeyearleft, coursename, universityname, universityyearjoin, 
        universityyearleft, emailport, numberport, linkedinport, githubport, instaport}})
    Portfoliodetail.findOne({_id:id})
    .then(user=>{
        Userdetail.findOne({email:user.orgemail})
        .then(user2=>{
            req.flash('success_msg1', 'changes saved successfully !!!')
            res.redirect(`/users/${user2._id}/portfolioform/portfolio`)
        })
    })   
})
router.get("/:id/portfolioform/portfolio", auth, async(req, res) => {
    const {id} = req.params;
    const userid = await Userdetail.findOne({ _id : id });
    const orgemail=userid.email;
    Portfoliodetail.findOne({orgemail:orgemail})
    .then(user=>{
        if(user){
        res.render("portfolio",{user, userid});
        }
        else{
           req.flash('error_msg', 'you must fill portfolio details form first')
           res.redirect(`/users/${id}/portfolioform`) 
        }
    }).catch(err=>console.log(err));
})
router.get("/:id/portfolioform", auth, (req, res) => {
    user=req.user
    res.render("portfolioform")
})
router.post("/:id/portfolioform", async (req, res) => {
    const { id } = req.params
    const { name, role1, role2, role3, about, skill1, skill2, skill3, skill4, skill5, rate1,
    rate2, rate3, rate4, rate5, schoolname, schoolyearjoin, schoolyearleft, 
    collegename, collegeyearjoin, collegeyearleft, coursename, universityname, universityyearjoin, 
    universityyearleft, emailport, numberport, linkedinport, githubport, instaport } = await req.body
    const profiledetails = await Userdetail.findById({ _id: id });
    const newUser = new Portfoliodetail({
        orgemail: profiledetails.email,
        name,
        role:[{role1, role2, role3}],
        about,
        skill1,
        skill2,
        skill3,
        skill4,
        skill5,
        rate1,
        rate2,
        rate3,
        rate4,
        rate5,
        schoolname,
        schoolyearjoin,
        schoolyearleft,
        collegename,
        collegeyearjoin,
        collegeyearleft,
        coursename,
        universityname,
        universityyearjoin,
        universityyearleft,
        emailport,
        numberport,
        linkedinport,
        githubport,
        instaport
    })
    newUser.save()
    .then(user => {
    req.flash('success_msg', 'saved successfully')
    res.redirect(`/users/${id}/portfolioform/portfolio`);
    }).catch(err => console.log(err));

    console.log(profiledetails.email);
})
router.post("/login", async (req, res) => {
    try {
        let errorslog = [];
        email = req.body.email;
        password = req.body.password;
        useremail = await Userdetail.findOne({ email: email });
        userid = useremail._id
        if (useremail == null) {
            errorslog.push({ msg: "Invalid Login details" })
            res.render("login", {
                errorslog
            });
        }
        else {
            isMatch = await bcrypt.compare(password, useremail.password);
            if (isMatch) {
                emailver=useremail.email;
                const token = await useremail.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 1200000),
                    httpOnly: true
                })
                console.log(token);
                console.log("login successful")
                Portfoliodetail.findOne({orgemail:emailver})
                .then(user=>{
                    if(user){
                        res.redirect(`/users/${userid}/portfolioform/portfolio`)
                    }else{
                        res.redirect(`/users/${userid}/portfolioform`)
                    }
                }).catch(err=>console.log(err))
            } else {
                errorslog.push({ msg: "Invalid Login details" })
                res.render("login", {
                    errorslog
                });
            }
        }
    }
    catch (err) {
        console.log(err)
    }

})
router.get("/:id/portfolioform/:id/generateReport", (req, res) => {
    const {id}=req.params;
    Portfoliodetail.findOne({_id : id})
    .then(user=>{
        ejs.renderFile(path.join(__dirname + '/views/new.ejs'), {
            user: user
        }, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                let options = {
                    "height": "11.25in",
                    "width": "8.5in",
                    "header": {
                        "height": "20mm",
                    },
                    "footer": {
                        "height": "20mm",
                    },
    
                };
                pdf.create(data, options).toFile("report.pdf", function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send("File created successfully");
                    }
                });
            }
        });
    }).catch(err=>console.log(err))
})
	


router.get("/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token
        })
        res.clearCookie("jwt")
        console.log("logout successfully");
        await req.user.save();
        req.flash("success_msg", "logged out successfully")
        res.redirect("/users/login")
    } catch (err) { console.log(err) }
})
module.exports = router;