import mongoose, { Document, Schema } from "mongoose";

interface IGrade {
    subject: string;  
    score: number;   
}

export interface IUser extends Document {
    name: string;
    passportId: string;
    password: string;
    grades?: IGrade[];  
    role: "teacher" | "student";
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    passportId: {
        type: String,
        required: [true, "Please provide your passportId"],
        unique: true, 
        match: [/^[0-9]{9}$/, "passportId must be  9 digits"]
    },
    password: {
        type: String,
        required: true,
        unique: true,
        match : [/^[0-8]{8}$/, "password must be 8 digits"],
    },
    grades: {
        type: [{
            subject: {
                type: String,
                required: [true, "Please provide subject name"],
            },
            score: {
                type: Number,
                required: [true, "Please provide score"],
            },
        }],
        default: [],
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true, 
    },
});

export default mongoose.model<IUser>("User", userSchema);
