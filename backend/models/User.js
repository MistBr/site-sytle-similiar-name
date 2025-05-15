import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { profile } from 'console';

const { hash, compare } = bcrypt;
const { isEmail } = validator;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Por favor, informe seu nome'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe seu email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Por favor, forneça um email válido'],
    match: [/.+\@.+\..+/, 'Por favor, informe um email válido']
  },
  password: {
    type: String,
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    select: false
  },
  googleId: {
    type: String,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000; // Garante que o token seja criado após
  next();
});

// Método para comparar senhas
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await compare(candidatePassword, this.password);
};

// Método para verificar se a senha foi alterada após o token JWT ser emitido
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Método para criar token de reset de senha
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutos
  
  return resetToken;
};

const User = model('User', userSchema);

export default User;