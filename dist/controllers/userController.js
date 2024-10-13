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
exports.getStudentsAverageGrade = exports.getStudentGrade = exports.login = exports.createUser = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// יצירת יוזר חדש
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ddd");
    try {
        const user = req.body;
        const newUser = yield userModel_js_1.default.create(user);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
});
exports.createUser = createUser;
// לוגין של יוזר
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_js_1.default.findOne({ password });
        if (!user || user.password !== password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // שים את הטוקן בקוקי
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });
        res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.login = login;
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
        const user = yield userModel_js_1.default.findOne({ passportId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email });
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
