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
dotenv_1.default.config();
//הבאת כל הציונים של המשתמשים
const getAllGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        // שימוש ב-aggregate לשליפת שמות התלמידים והציונים שלהם
        const studentsWithGrades = yield userModel_js_1.default.aggregate([
            {
                $match: { role: "student" } // מסנן רק את המשתמשים שהם תלמידים
            },
            {
                $project: {
                    _id: 0, // לא להציג את השדה _id
                    name: 1, // להציג את שם התלמיד
                    grades: 1 // להציג את הציונים של התלמיד
                }
            }
        ]);
        if (!studentsWithGrades || studentsWithGrades.length === 0) {
            res.status(404).json({ message: "No students found" });
            return;
        }
        res.status(200).json(studentsWithGrades);
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
//הוספת ציון לתלמיד
const addGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        // הוספת ציון לתלמיד
        const { password, subject, score } = req.body;
        if (!password || !score || !subject) {
            res.status(400).json({ message: 'Missing passportId or grade' });
            return;
        }
        const updateGrade = yield userModel_js_1.default.findOneAndUpdate({ password: password }, { $push: { grades: { subject: subject, score: score } } }, { new: true });
        if (!updateGrade) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Grade added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
});
exports.addGrade = addGrade;
// //מחיקת ציון לתלמיד
// export const deleteGrade = async (req: UserRequest, res: Response): Promise<void> => {
//     try {
//         // בדיקה אם המשתמש הוא מורה
//         if (req.user?.role !== "teacher") {
//             res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
//             return;
//         }
//         // מחיקת ציון לתלמיד
//        const {password,subject } = req.body;
//        if(!password || !subject) {
//         res.status(400).json({ message: 'Missing passportId or grade' });
//         return;
//        }
//        const updateGrade = await userModel.findOneAndUpdate({ passportId: password }, { $pull: { grades: {subject: subject } } }, { new: true });
//        if (!updateGrade) {
//         res.status(404).json({ message: 'User not found' });
//         return;
//        }
//        res.status(200).json({ message: 'Grade deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting grade" });
//     }
// }
//עדכון ציון לתלמיד
const updateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // בדיקה אם המשתמש הוא מורה
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        // עדכון ציון לתלמיד
        const { password, subject, score } = req.body;
        if (!password || !score || !subject) {
            res.status(400).json({ message: 'Missing passportId or grade' });
            return;
        }
        const updateGrade = yield userModel_js_1.default.findOneAndUpdate({ passportId: password }, { $set: { grades: { subject: subject, score: score } } }, { new: true });
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
