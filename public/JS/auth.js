import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('private/credentials.json'));

passport.use(new GoogleStrategy({
    clientID: credentials.client_id,
    clientSecret: credentials.client_secret,
    callbackURL: "https://practica-client-qahj5bfry-davids-projects-7b10cc3e.vercel.app/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

// Serializar y deserializar usuario (necesario para sesiones)
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
