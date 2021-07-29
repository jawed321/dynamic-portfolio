const express=require("express");
const router=express.Router();
const auth=require("../config/auth");

router.get("/",(req,res)=>{
    res.render("index");
})
router.get("/:id/dashboard",auth,(req,res)=>{
    user=req.user;
    res.render("dashboard");
})

module.exports=router;