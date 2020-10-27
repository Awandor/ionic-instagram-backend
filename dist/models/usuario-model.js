"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
});
usuarioSchema.method('compararPassword', function (password = '') {
    // Necesitamos que sea una función normal para que this apunte correctamente
    // Para que el lint de TS no de error tenemos que cambiar en tsconfig.json la propiedad noImplicitThis a false
    // Seteamos por defecto password a string vacío por si el usuario no envía nada para que la función no explote
    // console.log('What is this?', this);
    // console.log('What is password?', password);
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    return false;
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
