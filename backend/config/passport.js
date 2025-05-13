import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Estratégia local (email/senha) - se estiver usando
import { Strategy as LocalStrategy } from 'passport-local';

const configurePassport = () => {
  console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  console.log("GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
  // Estratégia Google OAuth
  passport.use( 
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5173/api/auth/google/callback',
        proxy: true,
        passReqToCallback: true
      },  
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              email: profile.emails[0].value,
              name: profile.displayName,
              googleId: profile.id,
              isVerified: true // Adicionado do segundo código
            });
          } else if (!user.googleId) {
            // Se o usuário já existir mas não tiver googleId, atualizamos
            user.googleId = profile.id;
            user.isVerified = true; // Marca como verificado ao conectar com Google
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Serialização do usuário para a sessão
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Desserialização do usuário
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default configurePassport;