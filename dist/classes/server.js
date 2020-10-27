"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Este archivo sólo va a tener esta clase, puedo poner default para que cuando la importe en otro lugar
// dé por hecho que lo que yo quiero hacer es importar esta clase de servidor
class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.app = express_1.default();
    }
    start(callback) {
        this.app.listen(this.port, callback);
    }
}
exports.default = Server;
