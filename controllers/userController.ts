import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { IUser } from '../models/userModel.js'; 
import { UserRequest } from '../middleware/auth.js'; 

dotenv.config(); 




// יצירת יוזר חדש
export const createUser = async (req: Request, res: Response) => {
    console.log("ddd");
    try {
        const user = req.body;
        const newUser = await userModel.create(user);
        res.status(201).json(newUser);
    } catch (error:any) {
        res.status(409).json({ message: error.message });
    }
}

// לוגין של יוזר
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ password });

        if (!user || user.password !== password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; 
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        // שים את הטוקן בקוקי
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000, 
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}




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
        const user = await userModel.findOne({ passportId: req.user?.email });

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



    


        
      
       




