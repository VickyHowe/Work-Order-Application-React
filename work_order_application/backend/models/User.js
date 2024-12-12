const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    role: { 
        type: String,
        ref: 'Role',
        required: true
    }
});

module.exports = mongoose.model('User ', userSchema);