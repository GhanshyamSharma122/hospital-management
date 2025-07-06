/*
 Doctor
 - GET /doctor/appointments (view doctor appointments) done
 - POST /doctor/record (add diagnosis & prescription) done
 - GET /doctor/patient/:id (view patient history)done
*/
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { roleMiddleware } from "../middlewares/role.middleware.js"
import { completeAppointment, getAllAppointments, getPatientHistory } from "../controllers/doctor.controller.js"
const router=Router()
router.route("/complete-appointment").post(
    verifyJWT,
    roleMiddleware("doctor"),
    completeAppointment
)
router.route("/appointments").get(
    verifyJWT,
    roleMiddleware("doctor"),
    getAllAppointments
)
router.route("/patient/:patientemail").get(
    verifyJWT,
    roleMiddleware("doctor"),
    getPatientHistory
)
export default router