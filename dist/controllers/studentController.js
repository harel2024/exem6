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
exports.getStudentsAverageGrade = exports.getStudentGrade = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// מחזיר את הציון של המשתמש
const getStudentGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // מחפש את המשתמש על פי תעודת הזהות (passportId)
        const user = yield userModel_js_1.default.findOne({ password: (_a = req.user) === null || _a === void 0 ? void 0 : _a.password });
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
    }
    catch (error) {
        res.status(500).json({ message: "Error getting grade" });
    }
});
exports.getStudentGrade = getStudentGrade;
// מחשב את ממוצע הציונים של המשתמש
const getStudentsAverageGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // מחפש את המשתמש על פי תעודת הזהות (passportId)
        const user = yield userModel_js_1.default.findOne({ password: (_a = req.user) === null || _a === void 0 ? void 0 : _a.password });
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
    }
    catch (error) {
        res.status(500).json({ message: "Error getting average grade" });
    }
});
exports.getStudentsAverageGrade = getStudentsAverageGrade;
