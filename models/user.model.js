import mongoose from "mongoose";
const userSchema=new mongoose.model({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },
    avatar:{
        type:String,//cloudinary url
        required:true
    },
},{timestamps:true})
export const User=mongoose.model("User",userSchema)