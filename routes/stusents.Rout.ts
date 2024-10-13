
import express from "express";
import { getStudentGrade, getStudentsAverageGrade } from "../controllers/studentController.js";
import authenticateToken from "../middleware/auth.js"; 


const router = express.Router();

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

export default router;