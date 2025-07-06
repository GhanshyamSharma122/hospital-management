import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authRouter from './routes/auth.routes.js'
import adminRouter from './routes/admin.routes.js'
import patientRouter from './routes/patient.routes.js'
import doctorRouter from './routes/doctor.routes.js'
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/patient",patientRouter)
app.use("/api/v1/doctor",doctorRouter)

export {app}