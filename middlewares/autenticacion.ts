import { Response, Request, NextFunction } from 'express';
import Token from '../classes/token';


export const verificaToken = (req: any, resp: Response, next: NextFunction) => {

    // con el método get podemos acceder al header del request
    // x-token es como vamos a llamar a la key del token en el header

    const userToken = req.get('x-token') || ''; // Evitamos el null que daría error

    Token.comprobarToken(userToken).then((decoded: any) => {

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

}
