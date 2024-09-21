const express = require('express');

const zod = require('zod');
const {User} = require('../src/db/user')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const router = express.Router();


const signupBody = zod.object({ 
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signup", async(req, res) =>{
    const {success} = signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs parsing error"
        })
    }
   const existingUser = await User.findOne({
    username: req.body.username
   })

   if(existingUser){
    return res.status(411).json({
        message: "Email already taken / Incorrect inputs existing user error"
    })
   }

   const user = await User.create({ 
    username: req.body.username,
    password: req.body.password
   })



   const userId = user._id;

   const token = jwt.sign({userId}, JWT_SECRET)
    res.json({message:"User created success", token: token}, );
});

const signInBody = zod.object({ 
    username: zod.string().email(),
    password: zod.string(),
})

router.post("/signin", async(req, res)=>{
    const {success} = signInBody.safeParse(req.body);
    

    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    try {
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });
    
        if(user){
            const token = jwt.sign({userId: user._id}, JWT_SECRET);
            res.json({token:token});
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal server error" });
        
    }

})

module.exports = router
