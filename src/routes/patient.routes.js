/*
Patient
 - POST /patient/book (book an appointment)
 - GET /patient/appointments (view own appointments)
 - GET /patient/records (view own medical records)
*/
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { bookAppointment, getAllAppointments, getDoctorDetails, getMedicalRecord } from "../controllers/patient.controller.js";
const router =  Router()
router.route("/book").post(
    verifyJWT,
    roleMiddleware("patient"),
    bookAppointment
)
router.route("/appointments").get(
    verifyJWT,
    roleMiddleware("patient"),
    getAllAppointments
)
router.route("/get-doctor-details").get(
    verifyJWT,
    roleMiddleware("patient"),
    getDoctorDetails
)

router.route("/get-medical-record").get(
    verifyJWT,
    roleMiddleware("patient"),
    getMedicalRecord
)
export default router