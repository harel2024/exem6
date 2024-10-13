import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { IUser } from '../models/userModel.js'; 
import { UserRequest } from '../middleware/auth.js'; 

dotenv.config(); 


// הבאת כל היוזרים
export const getAllUsers = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "teacher") { 
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return; 
        }

        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: "Error getting all users" });
    }
}


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
    const { passportId, password } = req.body;

    try {
        const user = await userModel.findOne({ passportId });

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
        const user = await userModel.findOne({ passportId: req.user?.passportId });

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
        const user = await userModel.findOne({ passportId: req.user?.passportId });

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


//הבאת כל הציונים של המשתמשים
export const getAllGrades = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // שימוש ב-aggregate לשליפת שמות התלמידים והציונים שלהם
        const studentsWithGrades = await userModel.aggregate([
            {
                $match: { role: "student" }  // מסנן רק את המשתמשים שהם תלמידים
            },
            {
                $project: {
                    _id: 0,        // לא להציג את השדה _id
                    name: 1,       // להציג את שם התלמיד
                    grades: 1      // להציג את הציונים של התלמיד
                }
            }
        ]);

        if (!studentsWithGrades || studentsWithGrades.length === 0) {
            res.status(404).json({ message: "No students found" });
            return;
        }

        res.status(200).json(studentsWithGrades);
    } catch (error) {
        res.status(500).json({ message: "Error getting grades" });
    }
}



//ייבוא הממוצע ציונים של כל התלמידים ביחד 
export const getAverageAll = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // שימוש ב-aggregate לשליפת ממוצע הציונים של כל התלמידים
        const averageGrade = await userModel.aggregate([
            {
                $match: { role: "student" }  // מסנן רק את המשתמשים שהם תלמידים
            },
            {
                $project: {
                    _id: 0,        // לא להציג את השדה _id
                    grades: 1      // להציג את הציונים של התלמיד
                }
            },
            {
                $unwind: "$grades"  // הסתרת השדה grades
            },
            {
                $group: {
                    _id: null,     // לא להציג את השדה _id
                    averageGrade: { $avg: "$grades.score" }  // ממוצע הציונים
                }
            }
        ]);

        if (!averageGrade || averageGrade.length === 0) {
            res.status(404).json({ message: "No students found" });
            return;
        }

        res.status(200).json({ averageGrade: averageGrade[0].averageGrade });
    } catch (error) {
        res.status(500).json({ message: "Error getting average grade" });
    }
}



//הוספת ציון לתלמיד
export const addGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // הוספת ציון לתלמיד
       const {passportId,subject, score } = req.body;
     
       if(!passportId || !score|| !subject) {
        res.status(400).json({ message: 'Missing passportId or grade' });
        return;
       }

       const updateGrade = await userModel.findOneAndUpdate({ passportId: passportId }, { $push: { grades: {subject: subject, score: score } } }, { new: true });

       if (!updateGrade) {
        res.status(404).json({ message: 'User not found' });
        return;
       }

       res.status(200).json({ message: 'Grade added successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
}


//מחיקת ציון לתלמיד
export const deleteGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // מחיקת ציון לתלמיד
       const {passportId,subject } = req.body;
       if(!passportId || !subject) {
        res.status(400).json({ message: 'Missing passportId or grade' });
        return;
       }

       const updateGrade = await userModel.findOneAndUpdate({ passportId: passportId }, { $pull: { grades: {subject: subject } } }, { new: true });

       if (!updateGrade) {
        res.status(404).json({ message: 'User not found' });
        return;
       }

       res.status(200).json({ message: 'Grade deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting grade" });
    }
}


//עדכון ציון לתלמיד
export const updateGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // בדיקה אם המשתמש הוא מורה
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }

        // עדכון ציון לתלמיד
       const {passportId,subject, score } = req.body;
       if(!passportId || !score|| !subject) {
        res.status(400).json({ message: 'Missing passportId or grade' });
        return;
       }

       const updateGrade = await userModel.findOneAndUpdate({ passportId: passportId }, { $set: { grades: {subject: subject, score: score } } }, { new: true });

       if (!updateGrade) {
        res.status(404).json({ message: 'User not found' });
        return;
       }    

       res.status(200).json({ message: 'Grade updated successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error updating grade" });
    }
}


    


        
      
       




