"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_js_1 = require("../controllers/teacherController.js");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const router = express_1.default.Router();
router.use(auth_js_1.default);
router.route("/teacher").get(teacherController_js_1.getAllUsers);
router.route("/teacher/getAllGrades").get(teacherController_js_1.getAllGrades);
router.route("/teacher/getAverageAll").get(teacherController_js_1.getAverageAll);
router.route("/teacher/addGrade").post(teacherController_js_1.addGrade);
router.route("/teacher/updateGrade").post(teacherController_js_1.updateGrade); //צריך בדיקה
// router.route("/teacher/deleteGrade").post(deleteGrade);//צריך בדיקה
exports.default = router;
