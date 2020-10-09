// console.log('Hola mundo');

import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

// Body Parser
server.app.use(bodyParser.urlencoded({ extended: true }));

server.app.use(bodyParser.json());

// Rutas de la app
server.app.use('/user', userRoutes);

// Conectar a la bbdd mongoDB
// connect recibe la bbdd, parámetros y un callback
mongoose.connect('mongodb://localhost:27017/instagram', { useNewUrlParser: true, useCreateIndex: true }, (err) => {

    if (err) {

        throw err;

    }

    console.log('Base de datos mongoDB CONNECTED');

});

// Levantar express
server.start(() => {

    console.log(`Servidor express corriendo en puerto ${server.port}`);

});
