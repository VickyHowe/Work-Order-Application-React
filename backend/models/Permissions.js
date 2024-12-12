const mongoose = require("mongoose");
const Role = require("./Role");

const permissionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;Role.js