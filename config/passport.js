import LocalStrategy from 'passport-local';
import fbStrategy from 'passport-facebook';
import ggStrategy from 'passport-google-oauth20';
import githubStrategy from 'passport-github2';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import config from './config.js';

export default (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });


    // Local Login
    passport.use('login', new LocalStrategy.Strategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
            session: false
        },
        async (req, username, password, done) => {
            try {
                const user = await User.findOne({
                    authId: username,
                    method: 'local'
                });
                if (!user) {
                    return done(null, false, {
                        message: 'Tài khoản không tồn tại!'
                    });

                }
                const matched = await bcrypt.compare(password, user.secret);
                if (matched) {
                    req.session.user = user;
                    done(null, user);
                } else {
                    done(null, false, {
                        message: 'Tài khoản hoặc mật khẩu không chính xác!'
                    })
                }
            } catch (err) {
                console.log(err.message);
            }
        }
    ));

    // Facebook Login
    passport.use('login-facebook', new fbStrategy.Strategy({
            clientID: config.FB_CLIENT_ID,
            clientSecret: config.FB_CLIENT_SECRET,
            callbackURL: config.FB_CALLBACK_URL,
            profileFields: ['email', 'displayName', 'picture.type(large)'],
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
            } catch (err) {
                console.log(err);
            }
        }
    ));

    // Google Login
    passport.use('login-google', new ggStrategy.Strategy({
            clientID: config.GG_CLIENT_ID,
            clientSecret: config.GG_CLIENT_SECRET,
            callbackURL: config.GG_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
            } catch (err) {
                console.log(err);
            }
        }
    ));

    // Github Login
    passport.use('login-github', new githubStrategy.Strategy({
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile);
            } catch (err) {
                console.log(err);
            }
        }
    ));
}