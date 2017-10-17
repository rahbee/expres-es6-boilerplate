import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Debug from 'debug';

const debug = Debug('express-app');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    passwordConf: {
        type: String,
        required: true,
    }
});

//hashing a password before saving it to the database
UserSchema.pre('save',  function(next) {
    // this is user object
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.password = hash;
        this.passwordConf = hash;
        next();
    })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;