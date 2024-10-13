import express from "express";
import { createUser, login } from "../controllers/userController.js";


const router = express.Router();

/**
 * @swagger
 * /register:
 *  post:
 *      summary: Create a new teacher or student
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          role:
 *                              type: string
 *                              enum: [teacher, student]
 *                              default: student
 *                          className:
 *                              type: string
 * 
 *          example: 
 *              name: "name"
 *              email: "123456789"
 *              password: "12345678"
 *              role: "student"
 *              className: "class name"
 *      responses: 
 *          200:
 *              description: User created successfully      
 */
router.route("/register").post(createUser);//הרשמה למערכת



/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login a teacher or student
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          password:
 *                              type: string
 *                          email:
 *                              type: string
 * 
 *      responses:
 *          200:
 *              description: User logged in successfully
 *          400:
 *              description: Bad request
 * 
 */
router.route("/login").post(login);//התחברות






export default router;
