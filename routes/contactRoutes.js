const express=require("express");

const router=express.Router();

router.route("/").get((req,res)=>{
    res.status(200).json({message:"get all contactsaa"});
});

module.exports=router;
