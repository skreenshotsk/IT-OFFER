// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { getUserByEmail, comparePassword } = require('../models/userModel');

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Неверный email' });
        }
        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
          return done(null, false, { message: 'Неверный пароль' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.serializeUser((user, done) => {
    done(null, user.email); // Сериализация по email
  });
  
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await getUserByEmail(email);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  module.exports = passport;