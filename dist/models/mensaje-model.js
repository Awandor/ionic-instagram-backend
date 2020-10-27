"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mensajeSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    texto: {
        type: String // En mongoose el tipo string es con mayúscula
    },
    imgs: [{
            type: String
        }],
    coords: {
        type: String,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir un usuario vinculado']
    }
});
// el método pre se dispara justa antes de grabar en base de datos
mensajeSchema.pre('save', function (next) {
    // Necesitamos que sea una función normal para que this apunte correctamente
    this.created = new Date();
    next();
});
exports.Mensaje = mongoose_1.model('Mensaje', mensajeSchema);
