import { ApiError } from "../utils/ApiError.js"
import { Appointment } from "../models/appointment.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Record } from "../models/medical_record.model.js"
const getAllAppointments=asyncHandler(async (req ,res) => {
    if(!req.user?._id){
        throw new ApiError(400,"no user found")
    }
    const doctorAppointments=await Appointment.find({doctor_id:req.user._id})
    return res
    .status(200)
    .json(
            new ApiResponse(
            200,
            doctorAppointments,
            "appointments fetched successfully"
        )
    )

})
const completeAppointment=asyncHandler(async (req , res ) => {
    const {appointment_id,docNotes,prescription}=req.body
    const appointment=await Appointment.findOne({_id:appointment_id})
    if(!appointment){
        throw new ApiError(400,"the requested appointment id not found")
    }
    if(!req.user._id.equals(appointment.doctor_id)){
        throw new ApiError(401,"unauthorized access")
    }
    appointment.status="completed"
    await appointment.save({validateBeforeSave:false})
    await Record.create({
        appointment_id,
        docNotes,
        prescription,
    })
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "medical record created successfully"
        )
    )
})
const getPatientHistory=asyncHandler(async (req, res) => {
    const patientemail=req.params.patientemail
    const patient=await User.findOne({email:patientemail})
    if(!patient){
        throw new ApiError(400,"patient not found")
    }
    if(patient.role!=="patient"){
        throw new ApiError(400,"the given user email is not of patients")
    }
    const appointments=await Appointment.find({patient_id:patient._id,}).select("_id")

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
            "medical records fetched successfully for given patient email"
        )
    )
})
export {getAllAppointments,
    completeAppointment,
    getPatientHistory}