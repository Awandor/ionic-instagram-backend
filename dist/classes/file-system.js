"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    /* guardarImagenTemporal(file: FileUpload, userId: string) {

        // Crear carpeta

        const path = this.crearCarpetaUsuario(userId);

        // Crear archivo con nombre único

        const nombreArchivo = this.generarNombreUnico(file.name);

        console.log('nombreArchivo', nombreArchivo);

        // Mover archivo del Temp a nuestra carpeta

        // El método mv no retorna promesa sino que ejecuta un callback
        file.mv(`${path}/${nombreArchivo}`, (err: any) => {

            if (err) {

                // No se puedo mover el archivo
            } else {

                // OK
            }
        });

    } */
    // Refactorizamos para que guardarImagenTemporal retorne una promesa
    guardarImagenTemporal(file, userId) {
        // Retornamos una promesa que luego cuando invoquemos la función podremos manejar con then y catch o con await y async
        return new Promise((resolve, reject) => {
            // Crear carpeta
            const path = this.crearCarpetaUsuario(userId);
            // Crear archivo con nombre único
            const nombreArchivo = this.generarNombreUnico(file.name);
            console.log('nombreArchivo', nombreArchivo);
            // Mover archivo del Temp a nuestra carpeta temporal
            // El método mv no retorna promesa sino que ejecuta un callback
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    // No se puedo mover el archivo
                    reject(err);
                }
                else {
                    // OK
                    resolve();
                }
            });
        });
    }
    crearCarpetaUsuario(userId) {
        // Todo aquí es síncrono y no usamos promesas
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        const pathUserTemp = pathUser + '/temp';
        console.log(pathUser);
        const carpetaExiste = fs_1.default.existsSync(pathUser);
        if (!carpetaExiste) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    generarNombreUnico(nombreOriginal) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        const nombreUnico = uniqid_1.default();
        return `${nombreUnico}.${extension}`;
    }
    moverArchivoTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        const pathImages = path_1.default.resolve(__dirname, '../uploads/', userId, 'images');
        if (!fs_1.default.existsSync(pathTemp)) {
            // Si no existe la carpeta temp es que no hay imágenes y retornamos un arreglo vacío
            return [];
        }
        if (!fs_1.default.existsSync(pathImages)) {
            // Si Sí existe carpeta temp pero no hay carpeta images la creamos
            fs_1.default.mkdirSync(pathImages);
        }
        const imagenesDeTemp = this.obtenerImagenesDeTemp(userId);
        imagenesDeTemp.forEach(imagen => {
            // Con el método renameSync podemos especificar el path y no cambiar el nombre,
            // Los archivos desaparecen de temp y son movidos a images
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathImages}/${imagen}`);
        });
        // Queremos retornar el arreglo de las imágenes para grabarlo después en la base de datos de Mongo
        return imagenesDeTemp;
    }
    obtenerImagenesDeTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        // readdirSync retorna un arreglo de strings
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getImagenUrl(userId, imagen) {
        const pathImagen = path_1.default.resolve(__dirname, '../uploads/', userId, 'images', imagen);
        const imagenExiste = fs_1.default.existsSync(pathImagen);
        if (!imagenExiste) {
            return path_1.default.resolve(__dirname, '../assets/img/no-image-banner.jpg');
        }
        return pathImagen;
    }
}
exports.default = FileSystem;
