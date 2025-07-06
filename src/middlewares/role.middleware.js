import { ApiError } from "../utils/ApiError.js"

export const roleMiddleware = (role)=>(req,res,next)=>{
    if(!role){
        throw new ApiError("the role is empty")
    }
    if(req.user.role===role){
        next()
    }else{
        throw new ApiError(401,"unauthorized request your don't have access right")
    }
}