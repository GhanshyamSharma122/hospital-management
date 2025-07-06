import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    slot: {
        type: String,
        required: true,
        enum: ["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"]
    },
    status: {
        type: String,
        required: true,
        enum: ["scheduled", "completed", "cancelled"]
    }
}, { timestamps: true });
export const Appointment = mongoose.model("Appointment", appointmentSchema)