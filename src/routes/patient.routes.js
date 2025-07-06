/*
Patient
 - POST /patient/book (book an appointment)
 - GET /patient/appointments (view own appointments)
 - GET /patient/records (view own medical records)
*/
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { bookAppointment } from "../controllers/patient.controller";
const router =  Router()
router.route("/book").post(
    verifyJWT,
    roleMiddleware("patient"),
    bookAppointment
)
export default router