import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Doctor } from "../models/doctor.model.js"
import { User } from "../models/user.model.js"

import { Patient } from "../models/patient.model.js"

const generateAccessAndRefreshTokens=async (userId)=>{
    try {
        const user=await User.findById(userId)
        
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError("something went wrong while generating access and refresh token")
    }
}
const loginUser=asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    if(!email){
        throw new ApiError(400,"email is required")
    }
    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(404,"user doesnot exist")
    }
    const isPasswordValid=await user.isPasswordCorrrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"invalid user credentials")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    const loggedInUser=await User.findById(user._id).
    select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "user logged in successfully"
        )
    )
    
})
const logoutUser =asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $unset:{
                refreshToken:1
            }
        ,
        },
        {
            new:true
        }
)
const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
})
const registerUser = asyncHandler(async (req, res) => {
    
    if (req.body.role === "admin") { 
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                await registerUtility(req, res),
                "user registered successfully"
            )
        )
        

    } else if (req.body.role == "doctor") {
        let result = await registerUtility(req, res)
        const { specifications, experience, available_days } = req.body
        if (!result._id) {
            throw new ApiError(400, "failed to create the doctor id")
        }
        const user_id = result._id
        const doctor = await Doctor.create(
            {
                user_id, specifications, experience, available_days
            }
        )
        if (!doctor) {
            throw new ApiError(500, "doctor cannot be created")
        }
        const createdDoctor = { ...await Doctor.findById(doctor._id).lean(), ...result }
        result = createdDoctor
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "user registered successfully"
            )
        )
    } else if (req.body.role === "patient") {
        let result = await registerUtility(req, res)
        const { age, gender, contact_info } = req.body
        if (!result._id) {
            throw new ApiError(400, "failed to create the patient id")
        }
        const user_id = result._id
        const patient = await Patient.create(
            {
                user_id, age, gender, contact_info
            }
        )
        if (!patient) {
            throw new ApiError(500, "patient cannot be created")
        }
        const createdPatient = { ...await Patient.findById(patient?._id).lean(), ...result }
        result = createdPatient
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "user registered successfully"
            )
        )

    } else {
        throw new ApiError(400, "invalid role")
    }
})



async function registerUtility(req, res) {
    const { name, email, password, role } = req.body
    if ([name, email, password, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all field are required")
    }
    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new ApiError(400, "user with the given email already existed")
    }
    
    const user = await User.create({
        name,
        email,
        password,
        role,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ).lean()
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user")
    }
    return createdUser;
}
const changePassword=asyncHandler(async (req,res ) => {
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user?._id)
    const isPasswordCorrrect=await user.isPasswordCorrrect(oldPassword)
    if(!isPasswordCorrrect){
        throw new ApiError(404,"invalid old password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "password changed successfully"
        )
    )

})
export { registerUser ,loginUser,logoutUser,changePassword}