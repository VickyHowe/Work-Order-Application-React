const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    canAssign: { type: [String], default: [] }, 
    permissions: [{ resource: String, action: String }]
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;