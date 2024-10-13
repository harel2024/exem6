"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../controllers/userController.js");
const router = express_1.default.Router();
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
router.route("/register").post(userController_js_1.createUser);
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
router.route("/login").post(userController_js_1.login);
exports.default = router;
