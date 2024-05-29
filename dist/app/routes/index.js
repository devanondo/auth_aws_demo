"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const example_route_1 = require("../modules/example/example.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/example',
        route: example_route_1.ExampleRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
