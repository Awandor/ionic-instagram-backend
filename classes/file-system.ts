import { FileUpload } from '../interfaces/file-upload';

import path from 'path';

import fs from 'fs';

import uniqid from 'uniqid';


export default class FileSystem {

    constructor() { };

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

    guardarImagenTemporal(file: FileUpload, userId: string) {

        // Retornamos una promesa que luego cuando invoquemos la función podremos manejar con then y catch o con await y async

        return new Promise((resolve: any, reject: any) => {

            // Crear carpeta

            const path = this.crearCarpetaUsuario(userId);

            // Crear archivo con nombre único

            const nombreArchivo = this.generarNombreUnico(file.name);

            console.log('nombreArchivo', nombreArchivo);

            // Mover archivo del Temp a nuestra carpeta temporal

            // El método mv no retorna promesa sino que ejecuta un callback
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {

                if (err) {

                    // No se puedo mover el archivo

                    reject(err);

                } else {

                    // OK
                    resolve();

                }

            });

        })
    }

    private crearCarpetaUsuario(userId: string) {

        // Todo aquí es síncrono y no usamos promesas

        const pathUser = path.resolve(__dirname, '../uploads/', userId);

        const pathUserTemp = pathUser + '/temp';

        console.log(pathUser);

        const carpetaExiste = fs.existsSync(pathUser);

        if (!carpetaExiste) {

            fs.mkdirSync(pathUser);

            fs.mkdirSync(pathUserTemp);

        }

        return pathUserTemp;
    }

    private generarNombreUnico(nombreOriginal: string) {

        const nombreArr = nombreOriginal.split('.');

        const extension = nombreArr[nombreArr.length - 1];

        const nombreUnico = uniqid();

        return `${nombreUnico}.${extension}`;
    }

    public moverArchivoTemp(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        const pathImages = path.resolve(__dirname, '../uploads/', userId, 'images');

        if (!fs.existsSync(pathTemp)) {

            // Si no existe la carpeta temp es que no hay imágenes y retornamos un arreglo vacío

            return [];

        }

        if (!fs.existsSync(pathImages)) {

            // Si Sí existe carpeta temp pero no hay carpeta images la creamos

            fs.mkdirSync(pathImages);

        }

        const imagenesDeTemp = this.obtenerImagenesDeTemp(userId);

        imagenesDeTemp.forEach(imagen => {

            // Con el método renameSync podemos especificar el path y no cambiar el nombre,
            // Los archivos desaparecen de temp y son movidos a images

            fs.renameSync(`${pathTemp}/${imagen}`, `${pathImages}/${imagen}`);

        });

        // Queremos retornar el arreglo de las imágenes para grabarlo después en la base de datos de Mongo

        return imagenesDeTemp;
    }

    private obtenerImagenesDeTemp(userId: string) {

        const pathTemp = path.resolve(__dirname, '../uploads/', userId, 'temp');

        // readdirSync retorna un arreglo de strings

        return fs.readdirSync(pathTemp) || [];

    }

    public getImagenUrl(userId: string, imagen: string) {

        const pathImagen = path.resolve(__dirname, '../uploads/', userId, 'images', imagen);

        const imagenExiste = fs.existsSync(pathImagen);

        if (!imagenExiste) {

            return path.resolve(__dirname, '../assets/img/no-image-banner.jpg');

        }

        return pathImagen;

    }
}