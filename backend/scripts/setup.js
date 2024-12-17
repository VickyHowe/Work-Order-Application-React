require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db'); 

const adminUser  = {
    username: 'admin',
    email: 'admin@example.com', // Add email address
    password: 'admin123', // Use a strong password in production
    securityQuestion: "What is your mother's maiden name?", // Example security question
    securityQuestionAnswer: "Smith" // Example answer to the security question
};

const roles = [
    { 
        name: 'admin', 
        canAssign: ['*'], 
        permissions: [
            { resource: '*', action: '*' }
        ] 
    },
    { 
        name: 'manager', 
        canAssign: ['employee', 'customer'], 
        permissions: [
            { resource: 'write', action: 'write_access' }, 
            { resource: 'delete', action: 'delete_access' }
        ] 
    },
    { 
        name: 'employee', 
        canAssign: [], 
        permissions: [{ resource: 'read', action: 'read_only' }] 
    },
    { 
        name: 'customer', 
        canAssign: [], 
        permissions: [{ resource: 'read', action: 'read_only' }] 
    },
];

const seedAdminUser  = async () => {
    try {
        // Connect to the database
        await connectDB(); 

        // Create default roles
        for (const roleData of roles) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (!existingRole) {
                console.log('Creating role:', roleData); // Log the role data
                const role = new Role(roleData);
                await role.save();
                console.log(`Role '${roleData.name}' created successfully.`);
            } else {
                console.log(`Role '${roleData.name}' already exists.`);
            }
        }

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ username: adminUser .username });
        if (existingAdmin) {
            console.log('Admin user already exists.');
            return;
        }

        // Create a new admin user
        const hashedPassword = await bcrypt.hash(adminUser .password, 10);
        const hashedSecurityQuestionAnswer = await bcrypt.hash(adminUser .securityQuestionAnswer, 10); // Hash the security question answer

        const adminRole = await Role.findOne({ name: 'admin' });
        console.log('Admin Role:', adminRole); 
        
        const newAdmin = new User({
            username: adminUser .username,
            email: adminUser .email, // Include email address
            password: hashedPassword,
            securityQuestion: adminUser .securityQuestion, // Add security question
            securityQuestionAnswer: hashedSecurityQuestionAnswer, // Add hashed answer
            role: adminRole._id, 
        });

        await newAdmin.save();
        console.log('Admin user created successfully.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        // Run the seed function
        seedAdminUser ();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });