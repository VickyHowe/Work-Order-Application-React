const mongoose = require('mongoose');


const phoneNumberRegex = /^\d{10}$/; 
const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/; 
const provinceRegex = /^[A-Za-z\s]+$/;

const userProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return phoneNumberRegex.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    province: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return provinceRegex.test(v);
            },
            message: props => `${props.value} is not a valid province!`
        }
    },
    postalCode: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return postalCodeRegex.test(v);
            },
            message: props => `${props.value} is not a valid postal code!`
        }
    },
});

module.exports = mongoose.model('UserProfile', userProfileSchema);