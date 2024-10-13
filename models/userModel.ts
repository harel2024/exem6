import mongoose, { Document, Schema } from "mongoose";

interface IGrade {
    subject: string;  
    score: number; 
    Comment: string;  
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    grades?: IGrade[];  
    role: "teacher" | "student";
    classId?: Schema.Types.ObjectId;
    className?: string;
    
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true, 
        match: [/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Please provide a valid email"],
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
            Comment:{
                type: String,
                required: [true, "Please provide Comment"],
            }
        }],
       
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true, 
    },
    className: {
        type: String,
        required: true,
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
    },
});

export default mongoose.model<IUser>("User", userSchema);
