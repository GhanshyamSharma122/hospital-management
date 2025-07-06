import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllUsers=asyncHandler(async (req ,res)=>{
    const users=await User.find().select("-password -refreshToken")
    return res
    .status(200)
    .json(
         new ApiResponse(
            200,
            users,
            "all users fetched successfully"
         )
    )
})
const deleteUser=asyncHandler(async (req,res)=>{
    const email=req.params.email
    const user=await User.findOne({email})
    if(!user){
        throw new ApiError(400,"no such user exists for provided email")
    }
    if(user.role==="admin"){
        throw new ApiError(400,"admin cannot be deleted")
    }
    const user_id=user._id 
    await User.deleteOne({_id:user_id})
   if(user.role==="doctor"){
     await Doctor.findOneAndDelete({user_id})
   }else if(user.role==="patient"){
    await Patient.findOneAndDelete({user_id})
   }
   return res
   .status(200)
   .json(
    new ApiResponse(
        200,
        {},
        "user deleted successfully"
    )
   )
})
const getDoctorInfo=asyncHandler(async (req,res) => {
    const email=req.params.email
    const user=await User.findOne({email}).select("-password -refreshToken")
    if(!user){
        throw new ApiError(404,"user not found")
    }
    if(user.role!=="doctor"){
        throw new ApiError(404,"the given user email is not of doctors")
    }
    
    const doctor=await Doctor.findOne({user_id:user?._id})
    if(!doctor){
        throw new ApiError(404,"doctor profile not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {...user.toObject(),...doctor.toObject()},
                "doctor retrieved successfully"
            )
        )
})


const approveDoctor=asyncHandler(async (req,res)=>{{
    const email=req.params.email
    const user=await User.findOne({email}).select("-password -refreshToken")
    if(!user){
        throw new ApiError(404,"user not found")
    }
    if(user.role!=="doctor"){
        throw new ApiError(404,"the given user email is not of doctors")
    }
    
    const doctor=await Doctor.findOne({user_id:user?._id})
    if(!doctor){
        throw new ApiError(404,"doctor profile not found")
    }
    doctor.is_approved=true;
    doctor.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "doctor approved succesfully"
        )
    )
}})
export {getAllUsers,deleteUser,getDoctorInfo,approveDoctor}