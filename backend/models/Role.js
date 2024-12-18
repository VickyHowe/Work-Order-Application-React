const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    canAssign: {
        type: [String], // or whatever type you need
        default: [],
    },
    permissions: {
        type: [String], // or whatever type you need
        default: [],
    },
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;