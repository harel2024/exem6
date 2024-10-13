
import express from "express";
import { getAllUsers ,getAllGrades,getAverageAll,addGrade,updateGrade } from "../controllers/teacherController.js";
import authenticateToken from "../middleware/auth.js"; 
import e from "express";


const router = express.Router();

router.use(authenticateToken); 


router.route("/teacher").get(getAllUsers);
router.route("/teacher/getAllGrades").get(getAllGrades);
router.route("/teacher/getAverageAll").get(getAverageAll);
router.route("/teacher/addGrade").post(addGrade);
router.route("/teacher/updateGrade").post(updateGrade);//צריך בדיקה
// router.route("/teacher/deleteGrade").post(deleteGrade);//צריך בדיקה




export default router