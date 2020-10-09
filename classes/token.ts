import jwt from 'jsonwebtoken';

export default class Token {

    private static seed: string = 'este-es -el-seed-secreto-de-mi-app';

    private static caducidad: string = '30d';

    // Ponemos el constructor pero no hace nada

    constructor() {

    }

    static getJsonwebtoken(payload: any): string {

        return jwt.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });

    }

    static comprobarToken(userToken: string) {

        /* jwt.verify(userToken, this.seed, (err, decoded) => {

            if (err) {

                // no confiar

            } else {

                // token válido
            }
        }); */

        // Lo vamos a hacer con una promesa

        return new Promise((resolve, reject) => {

            jwt.verify(userToken, this.seed, (err, decoded) => {

                if (err) {

                    reject();

                    // Lo manjeamos con el catch

                } else {

                    resolve(decoded);

                }

            });

        })
    }


}

// Todas las propiedades y métodos de esta clase van a ser estáticas
// no vamos a hacer const token = new Token();
// vamos a hacerlo directo como Token.obtenerToken();