import User from '../model/user';
import Debug from 'debug';

const debug = Debug('express-app');

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('signup', {
        title: 'Create Account'
    });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('username', 'Username is not valid').notEmpty;
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('passwordConf', 'Passwords do not match').equals(req.body.password);
    // req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/error');
    }


    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf
    });


    User.findOne({email: req.body.email}, (err, existingUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash('errors', {msg: 'Account with that email address already exists.'});
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            // req.logIn(user, (err) => {
            //     if (err) {
            //         debug(`Error while saving ${err}`);
            //         return next(err);
            //     }
            // });
            res.redirect('/');
        });
    });
};


/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('login', {
        title: 'Login'
    });
};


/**
 * POST /login
 * Login using local authentication
 */
exports.postLogin = (req, res, next) => {
    req.assert('username', 'Username is not valid').notEmpty;
    req.assert('password', 'Password must be at least 4 characters long').len(4);

    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/error');
    }


    const user = new User({
        username: req.body.username,
        password: req.body.password
    });


    User.findOne({username: req.body.username}, (err, existingUser) => {
            debug('postLogin err ', err, 'existingUser ', existingUser);
            if (err) {
                return next(err);
            }
            if (existingUser) {
                existingUser.comparePassword(user.password, (err, isMatch) => {
                    if (err) {
                        return res.redirect('/error');
                    }
                    if (isMatch) {
                        debug('postLogin existingUser err ', err, ' isMatch ', isMatch);
                        return res.redirect('/');
                    }

                    return res.redirect('/login');
                });
            }
        }
    );
};

