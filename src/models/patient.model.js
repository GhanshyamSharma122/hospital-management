import mongoose from "mongoose";
const patientSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        enum:['male','female']
    },
    contact_info:{
        type:String,
        required:true
    }
},{timestamps:true})
export const Patient=mongoose.model("Patient",patientSchema)