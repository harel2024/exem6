import mongoose , { Document, Schema } from "mongoose";

export interface IClass extends Document {
    name: string;
    students? : Schema.Types.ObjectId[];
    
}


const classSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
})


export default mongoose.model<IClass>("Class", classSchema);


 


