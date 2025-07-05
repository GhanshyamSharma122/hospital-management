import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
    patient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        start: {
            type: String,
            required: true
        },
        end: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        required: true,
        enum: ["scheduled", "completed", "cancelled"]
    }
}, { timestamps: true });
export const Appointment=mongoose.model("Appointment",appointmentSchema)