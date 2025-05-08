import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { login, register, googleLogin, protect } from '../controllers/auth.js';
import User from '../models/User.js'; // Garanta que o path e extensão estão corretos

const router = Router();

// Login tradicional
router.post('/register', register);
router.post('/login', login);

// Login com Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

// Callback do Google
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google-auth`,
    session: false
  }),
  googleLogin
);

// Rota protegida de exemplo
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
});

// Rota de registro normal
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Por favor, preencha todos os campos' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userToReturn = { ...savedUser._doc };
    delete userToReturn.password;

    res.status(201).json({ 
      user: userToReturn,
      token 
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(400).json({ 
      message: 'Erro ao criar conta',
      error: error.message 
    });
  }
});

// Rota de registro via Google
router.get('/auth/google', (req, res, next) => {
  const action = req.query.action;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: JSON.stringify({ action })
  })(req, res, next);
});

export default router;
