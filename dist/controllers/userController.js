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
exports.login = exports.createUser = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const classModel_js_1 = __importDefault(require("../models/classModel.js"));
dotenv_1.default.config();
// יצירת יוזר חדש
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const myClass = yield classModel_js_1.default.findOne({ name: user.className });
        if (user.role === "student") {
            if (!myClass) {
                res.status(404).json({ message: "Class not found" });
                return;
            }
            const newUser = yield userModel_js_1.default.create(user);
            newUser.classId = myClass._id;
            myClass.students.push(newUser._id);
        }
        else {
            if (myClass) {
                res.status(409).json({ message: "Class already exists" });
                return;
            }
            const newUser = yield userModel_js_1.default.create(user);
            const newClass = yield classModel_js_1.default.create({ name: user.className });
            newUser.classId = newClass._id;
            res.status(201).json(newClass._id);
        }
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
        if (!user || user.email !== email) {
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
