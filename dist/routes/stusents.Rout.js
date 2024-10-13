"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_js_1 = require("../controllers/studentController.js");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const router = express_1.default.Router();
router.use(auth_js_1.default);
/**
 * @swagger
 * /student/grade:
 *  get:
 *       summary: get my grade(student)
 *       responses:
 *           200:
 *               description: User registered successfully
 *
 *
 */
router.route("/student/grade").get(studentController_js_1.getStudentGrade);
/**
 * @swagger
 * /student/averageGrade:
 *  get:
 *       summary: get my average grade(student)
 *       responses:
 *           200:
 *               description: User registered successfully
 *
 *
 */
router.route("/student/averageGrade").get(studentController_js_1.getStudentsAverageGrade);
exports.default = router;
