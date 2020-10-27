"use strict";
// console.log('Hola mundo');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const mensaje_1 = __importDefault(require("./routes/mensaje"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
// ========================================
// Body Parser
// ========================================
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// ========================================
// File Upload
// ========================================
// server.app.use(fileUpload({useTempFiles: true})); // Añadir el parámetro si no funciona
server.app.use(express_fileupload_1.default());
// ========================================
// Configurar CORS
// ========================================
// Esta es la configuración para aceptar conexiones desde otros dominios / origenes
server.app.use(cors_1.default({ origin: true, credentials: true }));
// ========================================
// Rutas de la app
// ========================================
server.app.use('/user', usuario_1.default);
server.app.use('/messages', mensaje_1.default);
// ========================================
// Conectar a la bbdd mongoDB
// ========================================
// connect recibe la bbdd, parámetros y un callback
// mongoose.connect('mongodb://localhost:27017/instagram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
mongoose_1.default.connect('mongodb+srv://awandorDbUser:NpOTKXCtKVatgj2f@cluster0.njuvn.mongodb.net/instagram?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) {
        throw err;
    }
    console.log('Base de datos mongoDB CONNECTED');
});
// ========================================
// Levantar express
// ========================================
server.start(() => {
    console.log(`Servidor express corriendo en puerto ${server.port}`);
});
