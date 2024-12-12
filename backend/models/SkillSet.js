const mongoose = require("mongoose");

const skillSetSchema = new mongoose.Schema({
    skillName: { 
        type: String, 
        required: true, 
        unique: true 
    },
    description: { 
        type: String 
    }
});

const SkillSet = mongoose.model('SkillSet', skillSetSchema);

module.exports = SkillSet;