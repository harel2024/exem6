import userModel from "../models/userModel.js";
import {  Response } from "express";
import dotenv from "dotenv";
import classModel from "../models/classModel.js";
import { UserRequest } from '../middleware/auth.js'; 

dotenv.config();

//הבאת כל הציונים של התלמידים באותה כיתה
export const getAllGrades = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const teacher = req.user!;
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "erorr: Only teachers can access this page." });
            return;
        }
        //מסנן רק את התלמידים שבאותה כיתה
        const teacherClass = await classModel.findById(teacher.classId).populate("students");
        //יביא רק את הסטודנטים 
        const students = await userModel.find({ role: "student" });
        res.status(200).json(students );

        
      

    } catch (error) {
        res.status(500).json({ message: "Error getting grades" });
    }
}



//ייבוא הממוצע ציונים של כל התלמידים באותה כיתה 

export const getAverageAll = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const teacher = req.user!;
        if (teacher.role !== "teacher") { 
            res.status(403).json({ message: "ForbiD: Only teachers can access to page." });
            return; 
        }

        const avarege = await userModel.aggregate([
            {
                $match: {
                    role: "student",
                    className: teacher.className
                }
            },
            {
                $unwind: "$grades" 
            },
            {
                $group: {
                    _id: null, 
                    averageOfAll: { $avg: "$grades.score" } 
                }   
            },
            {
                $project: {
                    _id: 0, 
                    averageOfAll: 1 
                }
            }
        ]);
        
        
        res.status(200).json(avarege);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting not get all grades" });
    }
}


//לפי איידי הוספת ציון לתלמיד
export const addGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // הוספת ציון לתלמיד
        const { studentId, subject, score, comment } = req.body;

        // בדיקה אם יש את כל הנתונים שצריך כולל האיידי
        if (!studentId || !subject || !score) {
            res.status(400).json({ message: 'Missing student Id, subject, or grade' });
            return;
        }

              // עדכון הציון לתלמיד
        const updateGrade = await userModel.findOneAndUpdate(
            { _id: studentId },  // חיפוש לפי _id
            { $push: { grades: { subject, score, Comment: comment } } },  // הוספת הציון
            { new: true }
        );

        if (!updateGrade) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Grade added successfully', updatedUser: updateGrade });
    } catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
};




//לפיאיידי עדכון ציון לתלמיד
export  const updateGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // עדכון הציון 
        const { studentId, subject, score, comment } = req.body;
        if (!studentId || !score || !subject) {
            res.status(400).json({ message: 'Missing student Id or grade' });
            return;
        }

        const updateGrade = await userModel.findOneAndUpdate({ _id: studentId }, { $set: { grades: { subject: subject, score: score, comment: comment } } }, { new: true });

        if (!updateGrade) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Grade updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error updating grade" });
    }
}




