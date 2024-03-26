import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Por favor, proporciona un correo electrónico'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'Por favor, proporciona un nombre de usuario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Por favor, proporciona una contraseña'],
        select: false
    }
});

// Antes de guardar el usuario, encripta la contraseña
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);