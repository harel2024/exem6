"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateGrade = exports.addGrade = exports.getAverageAll = exports.getAllGrades = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const classModel_js_1 = __importDefault(require("../models/classModel.js"));
dotenv_1.default.config();
//הבאת כל הציונים של המשתמשים
const getAllGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const teacher = req.user;
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "erorr: Only teachers can access this page." });
            return;
        }
        //מסנן רק את התלמידים שבאותה כיתה
        const teacherClass = yield classModel_js_1.default.findById(teacher.classId).populate("students");
        //יביא רק את הסטודנטים
        const students = yield userModel_js_1.default.find({ role: "student" });
        res.status(200).json(students);
    }
    catch (error) {
        res.status(500).json({ message: "Error getting grades" });
    }
});
exports.getAllGrades = getAllGrades;
//ייבוא הממוצע ציונים של כל התלמידים ביחד 
const getAverageAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        // שימוש ב-aggregate לשליפת ממוצע הציונים של כל התלמידים
        const averageGrade = yield userModel_js_1.default.aggregate([
            {
                $match: { role: "student" } // מסנן רק את המשתמשים שהם תלמידים
            },
            {
                $project: {
                    _id: 0, // לא להציג את השדה _id
                    grades: 1 // להציג את הציונים של התלמיד
                }
            },
            {
                $unwind: "$grades" // הסתרת השדה grades
            },
            {
                $group: {
                    _id: null, // לא להציג את השדה _id
                    averageGrade: { $avg: "$grades.score" } // ממוצע הציונים
                }
            }
        ]);
        if (!averageGrade || averageGrade.length === 0) {
            res.status(404).json({ message: "No students found" });
            return;
        }
        res.status(200).json({ averageGrade: averageGrade[0].averageGrade });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting average grade" });
    }
});
exports.getAverageAll = getAverageAll;
const addGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        // הוספת ציון לתלמיד
        const { studentId, subject, score, comment } = req.body;
        // בדיקה אם יש את כל הנתונים הנדרשים
        if (!studentId || !subject || !score) {
            res.status(400).json({ message: 'Missing student Id, subject, or grade' });
            return;
        }
        // עדכון הציון לתלמיד
        const updateGrade = yield userModel_js_1.default.findOneAndUpdate({ _id: studentId }, // חיפוש לפי _id
        { $push: { grades: { subject, score, Comment: comment } } }, // הוספת הציון
        { new: true });
        if (!updateGrade) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Grade added successfully', updatedUser: updateGrade });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
});
exports.addGrade = addGrade;
// // export const deleteGrade = async (req: UserRequest, res: Response): Promise<void> => {
// //     try {
// //         // בדיקה אם המשתמש הוא מורה
// //         if (req.user?.role !== "teacher") {
// //             res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
// //             return;
// //         }
// //         // מחיקת ציון לתלמיד
// //        const {password,subject } = req.body;
// //        if(!password || !subject) {
// //         res.status(400).json({ message: 'Missing passportId or grade' });
// //         return;
// //        }
// //        const updateGrade = await userModel.findOneAndUpdate({ passportId: password }, { $pull: { grades: {subject: subject } } }, { new: true });
// //        if (!updateGrade) {
// //         res.status(404).json({ message: 'User not found' });
// //         return;
// //        }
// //        res.status(200).json({ message: 'Grade deleted successfully' });
// //     } catch (error) {
// //         res.status(500).json({ message: "Error deleting grade" });
// //     }
// // }
// //עדכון ציון לתלמיד
// export const updateGrade = async (req: UserRequest, res: Response): Promise<void> => {
//     try {
//         // בדיקה אם המשתמש הוא מורה
//         if (req.user?.role !== "teacher") {
//             res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
//             return;
//         }
//         // עדכון ציון לתלמיד
//        const {password,subject, score } = req.body;
//        if(!password || !score|| !subject) {
//         res.status(400).json({ message: 'Missing passportId or grade' });
//         return;
//        }
//        const updateGrade = await userModel.findOneAndUpdate({ passportId: password }, { $set: { grades: {subject: subject, score: score } } }, { new: true });
//        if (!updateGrade) {
//         res.status(404).json({ message: 'User not found' });
//         return;
//        }    
//        res.status(200).json({ message: 'Grade updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating grade" });
//     }
// }
const updateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        // עדכון ציון לתלמיד
        const { studentId, subject, score, comment } = req.body;
        if (!studentId || !score || !subject) {
            res.status(400).json({ message: 'Missing student Id or grade' });
            return;
        }
        const updateGrade = yield userModel_js_1.default.findOneAndUpdate({ _id: studentId }, { $set: { grades: { subject: subject, score: score, comment: comment } } }, { new: true });
        if (!updateGrade) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Grade updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating grade" });
    }
});
exports.updateGrade = updateGrade;
// הבאת כל היוזרים
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const users = yield userModel_js_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(404).json({ message: "Error getting all users" });
    }
});
exports.getAllUsers = getAllUsers;
