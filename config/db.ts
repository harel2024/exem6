import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://aral236262:rNOcbxESvKJuRvzC@cluster0.ch4yr.mongodb.net/classMenag?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to DB");
    } catch (error) {
        console.error("Error connecting to the database", error);
    }
};

export default connectDB;
