"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.verificaToken = (req, resp, next) => {
    // con el método get podemos acceder al header del request
    // x-token es como vamos a llamar a la key del token en el header
    const userToken = req.get('x-token') || ''; // Evitamos el null que daría error
    token_1.default.comprobarToken(userToken).then((decoded) => {
        // El token es válido
        console.log('Decoded', decoded);
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
        // El token no es válido
        resp.json({
            ok: false,
            mensaje: 'Token no es válido'
        });
    });
};
