import express from "express";
import { createUser, login, getStudentGrade, getStudentsAverageGrade } from "../controllers/userController.js";
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






export default router;
