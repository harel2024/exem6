import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { IUser } from '../models/userModel.js'; 
import { UserRequest } from '../middleware/auth.js'; 

dotenv.config();



// מחזיר את הציון של המשתמש
export const getStudentGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // מחפש את המשתמש על פי תעודת הזהות (passportId)
        const user = await userModel.findOne({ password: req.user?.password });

        // אם לא נמצא משתמש
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // אם למשתמש אין ציונים
        if (!user.grades) {
            res.status(404).json({ message: 'Grades not found' });
            return;
        }

        // מחזיר את הציון של המשתמש
        res.status(200).json({ grade: user.grades });
    } catch (error) {
        res.status(500).json({ message: "Error getting grade" });
    }
}




// מחשב את ממוצע הציונים של המשתמש
export const getStudentsAverageGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // מחפש את המשתמש על פי תעודת הזהות (passportId)
        const user = await userModel.findOne({ password: req.user?.password });

        // אם לא נמצא משתמש
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // אם למשתמש אין ציונים
        if (!user.grades || user.grades.length === 0) {
            res.status(404).json({ message: 'Grades not found' });
            return;
        }

        // מחשב את ממוצע הציונים של המשתמש באמצעות השדה 'score'
        const averageGrade = user.grades.reduce((sum, gradeObject) => sum + gradeObject.score, 0) / user.grades.length;

        res.status(200).json({ averageGrade });
    } catch (error) {
        res.status(500).json({ message: "Error getting average grade" });
    }
}