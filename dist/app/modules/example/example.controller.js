"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_await_1 = __importDefault(require("../../../shared/catch-async-await"));
const send_response_1 = __importDefault(require("../../../shared/send-response"));
const getExample = (0, catch_async_await_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Exmaple Created Successfully',
        data: [{ status: "okay" }],
    });
}));
exports.ExampleController = {
    getExample,
};
