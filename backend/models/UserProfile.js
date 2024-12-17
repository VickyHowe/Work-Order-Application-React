const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ',
        required: true
    },
    firstName: {
        type: String,
        required: false,
        trim: true, 
        minlength: 1, 
        maxlength: 50 
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minlength: 1,
        maxlength: 50
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); 
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100 
    },
    city: {
        type: String,
        required: false,
        trim: true,
        maxlength: 50
    },
    province: {
        type: String,
        required: false,
        trim: true,
        maxlength: 50
    },
    postalCode: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(v); 
            },
            message: props => `${props.value} is not a valid postal code!`
        }
    },
}, { timestamps: true }); 

module.exports = mongoose.model('User Profile', userProfileSchema);