import express from "express";
import { getAllUsers, createUser, login, getStudentGrade, getStudentsAverageGrade, getAllGrades, getAverageAll, addGrade, deleteGrade, updateGrade } from "../controllers/userController.js";
import authenticateToken from "../middleware/auth.js";
const router = express.Router();
/**
 * @swagger
 * /register:
 *  post:
 *      summary: Create a new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          passportId:
 *                              type: string
 *                          password:
 *                              type: string
 *                          role:
 *                              type: string
 *                              enum: [teacher, student]
 *                              default: student
 *          example:
 *              name: "name"
 *              passportId: "123456789"
 *              password: "12345678"
 *              role: "student"
 *      responses:
 *          200:
 *              description: User created successfully
 */
router.route("/register").post(createUser);
/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          passportId:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: User logged in successfully
 *          400:
 *              description: Bad request
 *
 */
router.route("/login").post(login);
router.use(authenticateToken);
/**
 * @swagger
 * /student/grade:
 *  get:
 *       summary: Register a new user
 *       responses:
 *           200:
 *               description: User registered successfully
 *
 *
 */
router.route("/student/grade").get(getStudentGrade);
/**
 * @swagger
 * /student/averageGrade:
 *  get:
 *       summary: Register a new user
 *       responses:
 *           200:
 *               description: User registered successfully
 *
 *
 */
router.route("/student/averageGrade").get(getStudentsAverageGrade);
router.route("/teacher").get(getAllUsers);
router.route("/teacher/getAllGrades").get(getAllGrades);
router.route("/teacher/getAverageAll").get(getAverageAll);
router.route("/teacher/addGrade").post(addGrade);
router.route("/teacher/updateGrade").post(updateGrade); //צריך בדיקה
router.route("/teacher/deleteGrade").post(deleteGrade); //צריך בדיקה
export default router;
