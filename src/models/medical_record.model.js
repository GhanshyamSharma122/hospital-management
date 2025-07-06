import mongoose from "mongoose";
const recordSchema=new mongoose.Schema({
    appointment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },
    docNotes:{
        type:String,
        required:true
    },
    prescription:{
        type:String,
        required:true
    }
    
},{timestamps:true})
export const Record=mongoose.model("Record",recordSchema)