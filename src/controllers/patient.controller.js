import { Appointment } from "../models/appointment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import {Doctor } from "../models/doctor.model.js"
import { Record } from "../models/medical_record.model.js";


const bookAppointment=asyncHandler(async (req, res)=>{
    const patient = req.user
    const {slot,date,doctorEmail}=req.body
    const isTimeRangeFormat = str => /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(str);
    const isValidDate = date => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(date) && !isNaN(new Date(date).getTime());
    }
    if(!patient?._id){
        throw new ApiError(400,"no user found")
    }

    if(!isTimeRangeFormat(slot)){
        throw new ApiError(401,"the time slot format should be hh:mm-hh:mm")
    }
    if(!isValidDate(date)){
        throw new ApiError(401,"the date format should be yyyy-mm-dd")
    }
    const status="scheduled"
    const doctor=await User.findOne({email:doctorEmail,})
    if(!doctor){
        throw new ApiError(400,"the doctor does not exists")
    }
    if(doctor.role!=="doctor"){
        throw new ApiError(400,"the given person is not a doctor")
    }
    const doctorAppointmentsOnGivenTimeSlot=await Appointment.find({doctor_id:doctor._id,slot,date})
    const patientAppointmentsOnGivenTimeSlot=await Appointment.find({patient_id:patient._id,slot,date})
    if( doctorAppointmentsOnGivenTimeSlot.length>0){
        throw new ApiError(400,"the doctor is not free at the given date and time slot")
    }
    if(patientAppointmentsOnGivenTimeSlot.length>0){
        throw new ApiError(400,"you have an appointment already in the given time slot")
    }
    const createdAppointment =await Appointment.create({
        patient_id:patient._id,
        doctor_id:doctor._id,
        date,
        slot,
        status,
    })
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createdAppointment,
            "appointment booked successfully"
        )
    )
    
})
const getAllAppointments=asyncHandler(async (req ,res) => {
    if(!req.user?._id){
        throw new ApiError(400,"no user found")
    }
    const patientAppointments=await Appointment.find({patient_id:req.user._id})
    return res
    .status(200)
    .json(
        new ApiResponse(
        200,
        patientAppointments,
        "appointments fetched successfully"
    )
    )


})
const getDoctorDetails=asyncHandler(async (req , res ) => {
    const Doctors=await User.find({role:"doctor"}).select("-password -refreshToken -role -createdAt -updatedAt").lean()
    const listOfDoctorDetails=[]
    for(let doctor of Doctors){
        listOfDoctorDetails.push({...doctor,... await Doctor.findOne({user_id:doctor._id}).lean()})
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            listOfDoctorDetails,
            "doctor details fetched successfully"
        )
    )
})

const getMedicalRecord =asyncHandler(async (req,res ) => {
    const appointments=await Appointment.find({patient_id:req.user._id}).select("_id")

    const records=[]
    for (let appointment of appointments){
        const record=await Record.findOne({appointment_id:appointment}).lean()
        if(record){
            records.push(record)
        }
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            records,
            "medical records fetched successfully"
        )
    )
})
export {bookAppointment,
    getAllAppointments,
    getDoctorDetails,
    getMedicalRecord
}