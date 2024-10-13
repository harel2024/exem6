
import express from "express";
import { getAllUsers ,getAllGrades,getAverageAll,addGrade,updateGrade } from "../controllers/teacherController.js";
import authenticateToken from "../middleware/auth.js"; 
import e from "express";


const router = express.Router();

router.use(authenticateToken); 

/**
 * @swagger
 * /teacher:
 *  get:
 *       summary: get all students (teacher)
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher").get(getAllUsers);


/**
 * @swagger
 * /teacher/getAllGrades:
 *  get:
 *       summary: get all students grade(teacher)
 *       responses:
 *           200:
 *               description: User registered successfully
 */
router.route("/teacher/getAllGrades").get(getAllGrades);
router.route("/teacher/getAverageAll").get(getAverageAll);

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
router.route("/teacher/addGrade").post(addGrade);
router.route("/teacher/updateGrade").post(updateGrade);//צריך בדיקה
// router.route("/teacher/deleteGrade").post(deleteGrade);//צריך בדיקה




export default router