require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const UserProfile = require('../models/UserProfile'); // Import UserProfile model
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db'); 

const adminUser    = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    securityQuestion: "What is your mother's maiden name?",
    securityQuestionAnswer: "Smith",
    role: 'admin' // Directly assign the role name
};

const managerUser   = {
    username: 'manager',
    email: 'manager@example.com',
    password: 'manager123',
    securityQuestion: "What is your favorite color?",
    securityQuestionAnswer: "Blue",
    role: 'manager' // Directly assign the role name
};

const employeeUser   = {
    username: 'employee',
    email: 'employee@example.com',
    password: 'employee123',
    securityQuestion: "What is your pet's name?",
    securityQuestionAnswer: "Buddy",
    role: 'employee' // Directly assign the role name
};

const customerUser   = {
    username: 'customer',
    email: 'customer@example.com',
    password: 'customer123',
    securityQuestion: "What is your mother's maiden name?",
    securityQuestionAnswer: "Johnson",
    role: 'customer' // Directly assign the role name
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
        canAssign: ['employee', 'customer'], // Managers can assign roles to employees and customers
        permissions: [
            { resource: 'tasks', action: 'manage' },
            { resource: 'roles', action: 'view' },
            { resource: 'roles', action: 'assign' }, // Allow managers to assign roles
            { resource: 'profile', action: 'view' }, // Allow managers to view profiles
            { resource: 'profile', action: 'update' } // Allow managers to update profiles
        ] 
    },
    { 
        name: 'employee', 
        canAssign: [], 
        permissions: [
            { resource: 'tasks', action: 'view' },
            { resource: 'profile', action: 'update' }
        ] 
    },
    { 
        name: 'customer', 
        canAssign: [], 
        permissions: [
            { resource: 'pricelists', action: 'view' },
            { resource: 'profile', action: 'update' }
        ] 
    },
];

const seedRoles = async () => {
    for (const roleData of roles) {
        const existingRole = await Role.findOne({ name: roleData.name });
        if (!existingRole) {
            console.log('Creating role:', roleData);
            const role = new Role(roleData);
            await role.save();
            console.log(`Role '${roleData.name}' created successfully.`);
        } else {
            console.log(`Role '${roleData.name}' already exists.`);
        }
    }
};

const seedUsers = async () => {
    const users = [adminUser , managerUser , employeeUser , customerUser ];
    for (const userData of users) {
        const existingUser  = await User.findOne({ username: userData.username });
        if (existingUser ) {
            console.log(`${userData.username} already exists.`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const hashedSecurityQuestionAnswer = await bcrypt.hash(userData.securityQuestionAnswer, 10);

        // Find the role by name
        const role = await Role.findOne({ name: userData.role });
        if (!role ) {
            console.error(`Role '${userData.role}' not found for user ${userData.username}. Please ensure roles are seeded before users.`);
            continue; // Skip this user if the role does not exist
        }

        const newUser   = new User({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            securityQuestion: userData.securityQuestion,
            securityQuestionAnswer: hashedSecurityQuestionAnswer,
            role: role._id,
        });

        await newUser .save();
        console.log(`${userData.username} created successfully.`);

        // Create a default user profile for each user
        const defaultProfile = new UserProfile({
            user: newUser ._id,
            firstName: userData.username.charAt(0).toUpperCase() + userData.username.slice(1), // Capitalize first letter
            lastName: 'User  ',
            phoneNumber: '1234567890',
            address: '',
            city: '',
            province: '',
            postalCode: 'a1a1a1'
        });

        await defaultProfile.save();
        console.log(`Default profile created for ${userData.username}.`);
    }
};

const seedAdminUser  = async () => {
    try {
        // Connect to the database
        await connectDB(); 

        // Seed roles first
        await seedRoles();

        // Seed users
        await seedUsers();

    } catch (error) {
        console.error('Error seeding users:', error);
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