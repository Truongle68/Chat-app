const generateToken = require('../config/generateToken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const registerUser = asyncHandler(async(req,res)=>{
    const {name, email, password, role} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please enter all the fields")
    }

    const existUser = await User.findOne({email})

    if(existUser){
        res.status(400)
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    })
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("Register unsuccessfully!")
    }
})



const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body
    console.log(email,password)
    const user = await User.findOne({email})
    console.log(user)
    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid email or password")
    }
    
})

const allUser = asyncHandler(async(req,res)=>{
    const keyword = req.query.search 
    ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    } 
    : {}

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}})
    res.send(users)

})

module.exports ={
    registerUser,
    authUser,
    allUser
}