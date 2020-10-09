import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario-model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();

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

userRoutes.post('/login', (req: Request, resp: Response) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {

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

            const tokenGenerado = Token.getJsonwebtoken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            })

            return resp.json({
                ok: true,
                mensaje: 'La contraseña es correcta',
                token: tokenGenerado
            });

        } else {

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

userRoutes.post('/create', (req: Request, resp: Response) => {

    // console.log(resp); 

    // Body Parser crea el objeto body

    // Encriptamos password
    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: encryptedPassword
    }

    Usuario.create(user).then(userDB => {

        // Esta respuesta es enviada del backend al front

        const tokenGenerado = Token.getJsonwebtoken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        })

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
userRoutes.post('/edit', [verificaToken], (req: any, resp: Response) => {

    // console.log('Editar usuario request', req);

    const user = {
        nombre: req.body.nombre || req.usuario.nombre, // Si viene vacío conservar el viejo
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    // Tenemos req.usuario._id gracias al middleware verificaToken

    // on la opción new: true recibimos en el callback los nuevos datos grabados en la base de datos y no los antiguos

    Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {

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

        const tokenGenerado = Token.getJsonwebtoken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        })

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
userRoutes.post('/delete', [verificaToken], (req: any, resp: Response) => {

    // Tenemos req.usuario._id gracias al middleware verificaToken

    // on la opción new: true recibimos en el callback los nuevos datos grabados en la base de datos y no los antiguos

    Usuario.findByIdAndDelete(req.usuario._id, (err, userDB) => {

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

// Para poder usarlo fuera de este archivo lo exportamos

export default userRoutes;
