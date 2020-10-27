"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Token {
    // Ponemos el constructor pero no hace nada
    constructor() {
    }
    static getJsonwebtoken(payload) {
        return jsonwebtoken_1.default.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });
    }
    static comprobarToken(userToken) {
        /* jwt.verify(userToken, this.seed, (err, decoded) => {

            if (err) {

                // no confiar

            } else {

                // token válido
            }
        }); */
        // Lo vamos a hacer con una promesa
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                    // Lo manjeamos con el catch
                }
                else {
                    resolve(decoded);
                }
            });
        });
    }
}
exports.default = Token;
Token.seed = 'este-es -el-seed-secreto-de-mi-app';
Token.caducidad = '30d';
// Todas las propiedades y métodos de esta clase van a ser estáticas
// no vamos a hacer const token = new Token();
// vamos a hacerlo directo como Token.obtenerToken();
