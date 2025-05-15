import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User.js';
import { AppError } from '../utils/errorHandler.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};


const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' // Adicionado para melhor segurança
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove informações sensíveis do output
  user.password = undefined;
  if (user.__v) user.__v = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    console.log('Dados recebidos:', req.body);

    // 1) Validações básicas
    if (!name || !email || !password || !passwordConfirm) {
      return next(new AppError('Por favor, preencha todos os campos!', 400));
    }

    if (password !== passwordConfirm) {
      return next(new AppError('As senhas não coincidem!', 400));
    }

    // 2) Verificar se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Este email já está em uso!', 400));
    }

    // 3) Criar novo usuário (a senha será criptografada no pre-save hook do modelo)
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm
    });
    console.log('Usuário criado:', newUser);
    // 4) Gerar token e enviar resposta
    createSendToken(newUser, 201, res);

  } catch (err) {
    console.error('Erro no register:', err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('Tentando login com email:', email);

    // 1) Verificar se email e senha existem
    if (!email || !password) {
      console.log('Email ou senha ausentes');
      return next(new AppError('Por favor, forneça email e senha!', 400));
    }

    // 2) Verificar se o usuário existe e a senha está correta
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('Usuário não encontrado com esse email:', email);
      return next(new AppError('Email ou senha incorretos', 401));
    }

    console.log('Usuário encontrado:', user.email);
    console.log('Senha no banco (hash):', user.password); // cuidado com isso em produção
    console.log('Senha enviada:', password);              // cuidado com isso também

    const senhaCorreta = await user.correctPassword(password);
    console.log('Senha correta?', senhaCorreta);

    if (!senhaCorreta) {
      console.log('Senha incorreta para o email:', email);
      return next(new AppError('Email ou senha incorretos', 401));
    }

    // 3) Se tudo estiver ok, enviar token para o cliente
    console.log('Login bem-sucedido para:', email);
    createSendToken(user, 200, res);
  } catch (err) {
    console.error('Erro no login:', err);
    next(err);
  }
};


export const googleLogin = (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // Redireciona com token na URL
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/entrar`);
  }
};

export const protect = async (req, res, next) => {
  try {
    // 1) Obter o token e verificar se ele existe
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('Você não está logado! Por favor, faça login para ter acesso.', 401)
      );
    }

    // 2) Verificação do token (usando promisify para consistência)
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Verificar se o usuário ainda existe
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('O usuário pertencente a este token não existe mais.', 401)
      );
    }

    // 4) Verificar se o usuário alterou a senha após o token ter sido emitido
    // (implementação opcional - adicionar se necessário)
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next(new AppError('Senha alterada recentemente! Por favor, faça login novamente.', 401));
    // }

    // CONCEDE ACESSO À ROTA PROTEGIDA
    req.user = currentUser;
    res.locals.user = currentUser; // Adicionado para templates, se necessário
    next();
  } catch (err) {
    next(err);
  }
};