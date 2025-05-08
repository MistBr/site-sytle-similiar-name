import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import configurePassport from './config/passport.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './utils/errorHandler.js';


// Configuração de ambiente
dotenv.config();

// Conexão com o MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado ao MongoDB');
  } catch (err) {
    console.error('Erro na conexão com MongoDB:', err);
    process.exit(1);
  }
};
connectDB();

const app = express();

// Configuração de sessão
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions'
});

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

// Rotas
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Tratamento de erros
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de encerramento
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});