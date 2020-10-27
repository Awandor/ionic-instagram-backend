"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario-model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
/* userRoutes.get('/prueba', (req: Request, resp: Response) => {

    console.log(resp);

    resp.json({
        ok: true,
        mensaje: 'Todo funciona bien!!!'
    });

}); */
// ========================================
// Login de usuario
// ========================================
userRoutes.post('/login', (req, resp) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return resp.json({
                ok: false,
                mensaje: 'El usuario y/o la contraseña no son correctas'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenGenerado = token_1.default.getJsonwebtoken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            return resp.json({
                ok: true,
                mensaje: 'La contraseña es correcta',
                token: tokenGenerado
            });
        }
        else {
            return resp.json({
                ok: false,
                mensaje: 'El usuario y/o la contraseña no son correctas ***' // Los asteriscos son para pruebas se quitan en producción
            });
        }
    });
});
// ========================================
// Crear usuario
// ========================================
userRoutes.post('/create', (req, resp) => {
    // console.log(resp); 
    // Body Parser crea el objeto body
    // Encriptamos password
    const encryptedPassword = bcrypt_1.default.hashSync(req.body.password, 10);
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        avatar: req.body.avatar,
        password: encryptedPassword
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        // Esta respuesta es enviada del backend al front
        const tokenGenerado = token_1.default.getJsonwebtoken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        resp.json({
            ok: true,
            token: tokenGenerado
        });
    }).catch(err => {
        resp.json({
            ok: false,
            error: err
        });
    });
});
// ========================================
// Editar un usuario
// ========================================
// Como segundo argumento van los middlewares como arreglo
userRoutes.post('/edit', [autenticacion_1.verificaToken], (req, resp) => {
    // console.log('Editar usuario request', req);
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    // Tenemos req.usuario._id gracias al middleware verificaToken
    // on la opción new: true recibimos en el callback los nuevos datos grabados en la base de datos y no los antiguos
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return resp.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        // Llegados a este punto hay que generar un nuevo token pues se puedo haber cambiado al actualizar alguna propiedad del token
        const tokenGenerado = token_1.default.getJsonwebtoken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        resp.json({
            ok: true,
            mensaje: 'La contraseña es correcta',
            token: tokenGenerado
        });
    });
});
// ========================================
// Borrar un usuario
// ========================================
// Como segundo argumento van los middlewares como arreglo
userRoutes.post('/delete', [autenticacion_1.verificaToken], (req, resp) => {
    // Tenemos req.usuario._id gracias al middleware verificaToken
    // on la opción new: true recibimos en el callback los nuevos datos grabados en la base de datos y no los antiguos
    usuario_model_1.Usuario.findByIdAndDelete(req.usuario._id, (err, userDB) => {
        if (err) {
            throw err;
        }
        if (!userDB) {
            return resp.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        resp.json({
            ok: true,
            nombre: userDB.nombre,
            mensaje: 'Usuario borrado'
        });
    });
});
// ========================================
// Obtener datos del usuario por Token
// ========================================
// Como segundo argumento van los middlewares como arreglo
userRoutes.get('/', [autenticacion_1.verificaToken], (req, resp) => {
    // Tenemos req.usuario gracias al middleware verificaToken
    const usuario = req.usuario;
    resp.json({
        ok: true,
        usuario // usuario: usuario
    });
});
// Para poder usarlo fuera de este archivo lo exportamos
exports.default = userRoutes;
