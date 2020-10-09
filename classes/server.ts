import express from 'express';

// Este archivo sólo va a tener esta clase, puedo poner default para que cuando la importe en otro lugar
// dé por hecho que lo que yo quiero hacer es importar esta clase de servidor

export default class Server {

    public app: express.Application;

    public port: number = 3000;

    constructor() {

        this.app = express();

    }

    start(callback: () => void) {

        this.app.listen(this.port, callback);

    }

}