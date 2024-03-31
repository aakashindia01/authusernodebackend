const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user')
const logger = require('../utils/logger');


const googleStrategy = new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ googleId: profile.id });

        if (user) {
            logger.info(`User: ${user._doc.email}`)
            return done(null, user);
        }

        const newUser = await User.create({ name: profile.displayName, googleId: profile.id, email: profile.emails[0].value, profilePhoto: profile.photos[0].value });
        logger.info(`New User Created: ${newUser._doc.email}`)
        return done(null, newUser);
    } catch (error) {
        logger.error('Error in Google authentication:', error);
        return done(error, false);
    }
})

passport.use(googleStrategy);

passport.serializeUser((user, next)=>{
    console.log('serializeUser', user.id)
    return next(null, user.id);
});
  
  passport.deserializeUser(async (userId, next)=>{
    try {
      console.log('deserializeUser', userId)
        const user = await User.findOne({_id: userId});
        return next(null, user);
    } catch (error) {
        return next(error, null);
    }
  })




