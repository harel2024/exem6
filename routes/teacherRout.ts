
import express from "express";
import {  getAllGrades,getAverageAll,addGrade,updateGrade } from "../controllers/teacherController.js";
import authenticateToken from "../middleware/auth.js"; 
import e from "express";


const router = express.Router();

router.use(authenticateToken); 




/**
 * @swagger
 * /teacher/getAllGrades:
 *  get:
 *       summary: get all students grade(teacher)
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher/getAllGrades").get(getAllGrades);//מקבל את כל הציונים של התלמידים

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
router.route("/teacher/getAverageAll").get(getAverageAll);//מקבל את הממוצע של כל התלמידים

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
router.route("/teacher/addGrade").post(addGrade);//מוסיף ציון לתלמיד

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
router.route("/teacher/updateGrade").post(updateGrade);//מעדכן ציון לתלמיד





export default router