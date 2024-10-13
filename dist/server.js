"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_js_1 = __importDefault(require("./routes/userRoute.js"));
const db_js_1 = __importDefault(require("./config/db.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_js_1 = require("./swagger.js");
const teacherRout_js_1 = __importDefault(require("./routes/teacherRout.js"));
const stusents_Rout_js_1 = __importDefault(require("./routes/stusents.Rout.js"));
dotenv_1.default.config();
(0, db_js_1.default)();
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_js_1.swaggerSpec));
app.use("/", userRoute_js_1.default, teacherRout_js_1.default, stusents_Rout_js_1.default);
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
