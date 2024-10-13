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
/**
 * @swagger
 * /teacher:
 *  get:
 *       summary: get all students (teacher)
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher").get(teacherController_js_1.getAllUsers);
/**
 * @swagger
 * /teacher/getAllGrades:
 *  get:
 *       summary: get all students grade(teacher)
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher/getAllGrades").get(teacherController_js_1.getAllGrades);
/**
 * @swagger
 * /teacher/getAverageAll:
 *  get:
 *       summary: get all students average grade(teacher)
 *       responses:
 *           200:
 *               description: User registered successfully
 *
 *
 */
router.route("/teacher/getAverageAll").get(teacherController_js_1.getAverageAll);
/**
 * @swagger
 * /teacher/addGrade:
 *  post:
 *       summary: add grade(teacher)
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          studentId:
 *                              type: string
 *
 *                          subject:
 *                              type: string
 *                          score:
 *                              type: number
 *                          comment:
 *                              type: string
 *          example:
 *              studentId: "123"
 *              grade: "10"
 *              subject: "math"
 *              score: "10"
 *              comment: "good"
 *
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher/addGrade").post(teacherController_js_1.addGrade);
/**
 * @swagger
 * /teacher/updateGrade:
 *  post:
 *       summary: update grade(teacher)
 *       requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          studentId:
 *                              type: string
 *
 *                          subject:
 *                              type: string
 *                          score:
 *                              type: number
 *                          comment:
 *                              type: string
 *          example:
 *              studentId: "123"
 *              grade: "10"
 *              subject: "math"
 *              score: "10"
 *              comment: "good"
 *
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher/updateGrade").post(teacherController_js_1.updateGrade);
// router.route("/teacher/deleteGrade").post(deleteGrade);//צריך בדיקה
exports.default = router;
