"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleRoutes = void 0;
const express_1 = require("express");
const example_controller_1 = require("./example.controller");
const router = (0, express_1.Router)();
router.get('/', example_controller_1.ExampleController.getExample);
exports.ExampleRoutes = router;
