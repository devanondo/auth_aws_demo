"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const example_route_1 = require("./app/modules/example/example.route");
const global_error_handler_1 = __importDefault(require("./middleware/global-error-handler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
//Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Application routes
app.use('/api/v1', example_route_1.ExampleRoutes);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🛢️ Server is Running...',
    });
});
// global Error handler
app.use(global_error_handler_1.default);
exports.default = app;
