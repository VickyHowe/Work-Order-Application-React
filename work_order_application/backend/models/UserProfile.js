const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneNumberRegex = /^\d{10}$/; 

const postalCodeRegex = /^\d{5}(-\d{4})?$/; 

const provinceRegex = /^[A-Za-z\s]+$/; 

const userProfileSchema = new mongoose.Schema({
  firstName: { 
    type: String,
    required: true 
  },
  lastName: { 
    type: String,
    required: true 
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role" 
  },
  phoneNumber: { 
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return phoneNumberRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: { 
    type: String 
  },
  city: { 
    type: String 
  },
  province: {  
    type: String,
    validate: {
      validator: function(v) {
        return provinceRegex.test(v);
      },
      message: props => `${props.value} is not a valid province!`
    }
  },
  postalCode: { 
    type: String,
    validate: {
      validator: function(v) {
        return postalCodeRegex.test(v);
      },
      message: props => `${props.value} is not a valid postal code!`
    }
  }
});

const UserProfile = mongoose.model("User Profile", userProfileSchema);

module.exports = UserProfile; 