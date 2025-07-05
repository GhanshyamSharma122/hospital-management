import mongoose from "mongoose";
const doctorSchema=new mongoose.model({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    specifications:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        default:0
    },
    available_days:{
        type: [String],
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        lowercase:true
    },
    is_approved:{
        type:Boolean,
        default:false
    }
},{timestamps:true})
export const User=mongoose.model("Doctor",doctorSchema)