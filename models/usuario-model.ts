import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type: String, // En mongoose el tipo string es con mayúscula
        required: [true, 'El nombre es obligatorio']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
});

usuarioSchema.method('compararPassword', function(password: string = ''): boolean {

    // Necesitamos que sea una función normal para que this apunte correctamente

    // Para que el lint de TS no de error tenemos que cambiar en tsconfig.json la propiedad noImplicitThis a false

    // Seteamos por defecto password a string vacío por si el usuario no envía nada para que la función no explote

    // console.log('What is this?', this);
    // console.log('What is password?', password);

    if (bcrypt.compareSync(password, this.password)) {

        return true;

    }

    return false;

});

interface IUsuario extends Document {
    nombre: string; // esto es tipo string de TS y va con minúscula
    avatar?: string;
    email: string;
    password: string;

    compararPassword(password: string): boolean;
}



export const Usuario = model<IUsuario>('Usuario', usuarioSchema);