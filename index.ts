// console.log('Hola mundo');

import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import mensajeRoutes from './routes/mensaje';
import fileUpload from 'express-fileupload';

const server = new Server();

// ========================================
// Body Parser
// ========================================

server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


// ========================================
// File Upload
// ========================================

// server.app.use(fileUpload({useTempFiles: true})); // Añadir el parámetro si no funciona
server.app.use(fileUpload());


// ========================================
// Rutas de la app
// ========================================

server.app.use('/user', userRoutes);
server.app.use('/messages', mensajeRoutes);


// ========================================
// Conectar a la bbdd mongoDB
// ========================================

// connect recibe la bbdd, parámetros y un callback
mongoose.connect('mongodb://localhost:27017/instagram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {

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
