import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Mensaje } from '../models/mensaje-model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const mensajeRoutes = Router();

const fileSystem = new FileSystem();

// ========================================
// Servicio Crear mensaje de usuario
// ========================================

mensajeRoutes.post('/', [verificaToken], (req: any, resp: Response) => {

    // Gracias a Body Parser recibimos en req los datos enviados del front en el body

    const mensaje = req.body;

    mensaje.usuario = req.usuario._id;

    // console.log('mensaje', mensaje);
    // console.log('req: !!!!!!', req);

    const imagenes = fileSystem.moverArchivoTemp(req.usuario._id); // Todo el proceso es síncrono

    mensaje.imgs = imagenes; // Ver modelo de mensaje


    // Grabamos en base de datos

    Mensaje.create(mensaje).then(async mensajeDB => {

        // Esta respuesta es enviada del backend al front

        // console.log('mensajeDB: ', mensajeDB);

        // Queremos añadir a mensajeDB todos los datos del usuario, una forma de hacerlo es usando populate
        // execPopulate retorna una promesa así que podemos usar await y async

        await mensajeDB.populate('usuario', '-password').execPopulate();

        resp.json({
            ok: true,
            mensaje: mensajeDB
        });

    }).catch(err => {

        resp.json({
            ok: false,
            error: err
        });
    });

});


// ========================================
// Servicio Obtener mensajes
// ========================================

// Podemos enviar o no el token, como prefiramos, de momento lo dejamos de forma pública

mensajeRoutes.get('/', /* [verificaToken], */async (req: any, resp: Response) => {

    // exec() retorna una promesa lo podemos resolver con await o con then

    /* Mensaje.find().exec().then(mensajes => {

        resp.json({
            ok: true,
            mensajes
        });

    }) */

    // Lo tengo que manejar como un número

    let pagina = Number(req.query.pagina) || 1; // Evitar NaN o undefined

    let mySkip = pagina - 1;
    mySkip = mySkip * 10;

    // Ordenamos desc, Limitamos a 10, Añadimos los datos del usuario sin la contraseña

    const mensajes = await Mensaje.find().sort({ _id: -1 }).skip(mySkip).limit(10).populate('usuario', '-password').exec();

    resp.json({
        ok: true,
        pagina,
        mensajes
    });

});


// ========================================
// Borrar un mensaje
// ========================================

// Como segundo argumento van los middlewares como arreglo
mensajeRoutes.post('/delete', [verificaToken], (req: any, resp: Response) => {

    /* resp.json({
        ok: true,
        usuarioId: req.usuario._id,
        mensajeId: req.body.messageId

    }); */

    // Recuperamos el ID del mensaje del body

    const mensajeId = req.body.messageId;

    Mensaje.findByIdAndDelete(mensajeId, (err, mensajeDB) => {

        if (err) {

            throw err;

        }

        if (!mensajeDB) {

            return resp.json({
                ok: false,
                mensaje: 'No existe un mensaje con ese ID'
            });

        }

        resp.json({
            ok: true,
            nombre: mensajeDB._id,
            mensaje: 'Mensaje borrado'
        });

    });

});


// ========================================
// Servicio Subir Archivo
// ========================================

mensajeRoutes.post('/upload', [verificaToken], async (req: any, resp: Response) => {

    if (!req.files) {

        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo'
        });

    }

    const archivo: FileUpload = req.files.image

    if (!archivo) {

        return resp.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo, error de ruta'
        });

    }

    if (!archivo.mimetype.includes('image')) {

        return resp.status(400).json({
            ok: false,
            mensaje: 'El archivo enviado no es una imagen'
        });

    }

    // Creamos una instancia de la clase `FileSystem`

    // const fileSystem = new FileSystem(); // Pero mejor la declaramos arriba al comienzo para no tener que declarla más veces

    await fileSystem.guardarImagenTemporal(archivo, req.usuario._id);

    // Con await el código se detiene aquí hasta que se haya completado guardarImagenTemporal

    resp.json({
        ok: true,
        file: archivo
    });

})


// ========================================
// Servicio Mostrar Imagen
// ========================================

// Al especificar el path '/image/:userId/:img' cada parte es obligatoria para que funcione

mensajeRoutes.get('/image/:userId/:img', (req: any, resp: Response) => {

    const usuarioId = req.params.userId;

    const imagen = req.params.img;

    const pathImagen = fileSystem.getImagenUrl(usuarioId, imagen);

    /* resp.json({
        ok: true,
        imagen: pathImagen
    }); */

    resp.sendFile(pathImagen); // Vemos la imagen

})


export default mensajeRoutes;