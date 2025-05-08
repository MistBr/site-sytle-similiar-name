import { verify } from 'jsonwebtoken';
import { findById } from '../models/User.js';
import AppError from '../utils/errorHandler.js';

export async function protect(req, res, next) {
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

    // 2) Verificação do token
    const decoded = await verify(token, process.env.JWT_SECRET);

    // 3) Verificar se o usuário ainda existe
    const currentUser = await findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('O usuário pertencente a este token não existe mais.', 401)
      );
    }

    // CONCEDE ACESSO À ROTA PROTEGIDA
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
}