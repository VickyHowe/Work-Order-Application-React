require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

// Define roles
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
            { resource: 'tasks', action: 'manage' },
            { resource: 'roles', action: 'view' },
            { resource: 'roles', action: 'assign' },
            { resource: 'profile', action: 'view' },
            { resource: 'profile', action: 'update' }
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

// Define users
const users = [
    {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        securityQuestion: "What is your mother's maiden name?",
        securityQuestionAnswer: "Smith",
        role: 'admin' // This should match the role name in the roles collection
    },
    {
        username: 'manager',
        email: 'manager@example.com',
        password: 'manager123',
        securityQuestion: "What is your favorite color?",
        securityQuestionAnswer: "Blue",
        role: 'manager'
    },
    {
        username: 'employee',
        email: 'employee@example.com',
        password: 'employee123',
        securityQuestion: "What is your pet's name?",
        securityQuestionAnswer: "Buddy",
        role: 'employee'
    },
    {
        username: 'customer',
        email: 'customer@example.com',
        password: 'customer123',
        securityQuestion: "What is your mother's maiden name?",
        securityQuestionAnswer: "Johnson",
        role: 'customer'
    }
];

// Function to seed roles
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

// Function to seed users
const seedUsers = async () => {
    for (const userData of users) {
        const existingUser    = await User .findOne({ username: userData.username });
        if (existingUser   ) {
            console.log(`${userData.username} already exists.`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const hashedSecurityQuestionAnswer = await bcrypt.hash(userData.securityQuestionAnswer, 10);

        // Find the role by name
        const role = await Role.findOne({ name: userData.role });
        if (!role) {
            console.error(`Role '${userData.role}' not found for user ${userData.username}. Please ensure roles are seeded before users.`);
            continue; // Skip this user if the role does not exist
        }

        const newUser    = new User ({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            securityQuestion: userData.securityQuestion,
            securityQuestionAnswer: hashedSecurityQuestionAnswer,
            role: role._id,
        });

        // Save the user
        await newUser  .save();
        console.log(`User   '${userData.username}' created successfully.`);

        // Create a user profile
        const userProfile = new UserProfile({
            user: newUser  ._id,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            address: '123 Main St',
            city: 'Anytown',
            state: 'Anystate',
 postalCode: 't1t1t1',
            country: 'USA',
            avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFRUXGBcZGBgXFRcVFRUVFxUYFxYVFRUYHSggGBolGxcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwABBAUGB//EADwQAAEDAgQDBgYHBwUAAAAEAAhEDIRIQVFhEyIyQlJxgTKSFBUQktHwMzUqGx0QgTlJT8FJSYnL/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A+4f/Z',
        });

        // Save the user profile
        await userProfile.save();
        console.log(`User  profile for '${userData.username}' created successfully.`);

        // Update the user document with the user profile ID
        newUser .userProfile = userProfile._id;
        await newUser .save();
        console.log(`User  '${userData.username}' updated with user profile ID.`);
    }
};

// Connect to the database
connectDB();

// Seed roles and users
(async () => {
    try {
        await seedRoles();
        await seedUsers();
        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
})();