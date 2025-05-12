const express = require('express');
const userRoutes = express.Router();
const User = require('../models/user');

userRoutes.post('/register',async(req,res)=>{
    try{
        const {username,email,role}=req.body;

        if(!username||username.length<3){
            return res.status(400).json({error:"username must be atleasst length of 3"});
        }

        const emailRegex = /^.+\@.+\..+/;
        if(!email|| !emailRegex.test(email)){
            return res.status(400).json({error:"email required"});
        }

        if(!['mechanic','owner'].includes(role)){
            return res.status(400).json({error:"role must be proper"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({error:"already exists"});
        }

        const user = new User({username,email,role});
        await user.save();

        res.status(201).json({message:"successfully registered",user});
    }catch(error){
        res.status(500).json({error:"Server error"});
    }
});

module.exports = userRoutes;