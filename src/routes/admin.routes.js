/*
Admin
 - GET /admin/users (view all users)
 - POST /admin/approve-doctor (approve doctor account)
 - DELETE /admin/delete-user/:id (delete user)
*/
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { getAllUsers,deleteUser, getDoctorInfo, approveDoctor } from "../controllers/admin.controller.js";
const router =Router()
router.route("/users").get(
    verifyJWT,
    roleMiddleware("admin"),
    getAllUsers
)
router.route("/delete-user/:email").delete(
    verifyJWT,
    roleMiddleware("admin"),
    deleteUser
)
router.route("/get-doctor-info/:email").get(
    verifyJWT,
    roleMiddleware("admin"),
    getDoctorInfo
)
router.route("/approve-doctor/:email").patch(
    verifyJWT,
    roleMiddleware("admin"),
    approveDoctor
)
export default router