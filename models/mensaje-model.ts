import { Schema, model, Document } from 'mongoose';

const mensajeSchema = new Schema({

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
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir un usuario vinculado']
    }

});

// el método pre se dispara justa antes de grabar en base de datos
mensajeSchema.pre<IMensaje>('save', function(next) {

    // Necesitamos que sea una función normal para que this apunte correctamente

    this.created = new Date();

    next();

})


interface IMensaje extends Document {
    created: Date; // esto es tipo string de TS y va con minúscula
    texto: string;
    img: string[];
    coords: string;
}


export const Mensaje = model<IMensaje>('Mensaje', mensajeSchema);
