require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose'); 
const connectDB = require('../config/db'); 
const User = require('../models/User'); 
const Role = require('../models/Role'); 
const Permission = require('../models/Permissions'); 
const bcrypt = require('bcryptjs'); 

const rolesAndPermissions = [
    {
        roleName: 'Admin',
        description: 'Administrator role with full permissions',
        permissions: ['create_notifications', 'view_notifications', 'edit_notifications', 'delete_notifications', 'manage_users', 'manage_roles']
    },
    {
        roleName: 'Customer',
        description: 'Customer role with limited permissions',
        permissions: ['view_notifications']
    },
    {
        roleName: 'Manager',
        description: 'Manager role with permissions to manage teams',
        permissions: ['view_notifications', 'create_notifications']
    },
    {
        roleName: 'Employee',
        description: 'Employee role with basic permissions',
        permissions: ['view_notifications']
    }
];

const createPermissions = async () => {
    const permissions = [
        { name: 'create_notifications' },
        { name: 'view_notifications' },
        { name: 'edit_notifications' },
        { name: 'delete_notifications' },
        { name: 'manage_users' },
        { name: 'manage_roles' }
    ];

    const createdPermissions = [];
    for (const perm of permissions) {
        const existingPerm = await Permission.findOne({ name: perm.name });
        if (!existingPerm) {
            const newPerm = new Permission(perm);
            await newPerm.save();
            createdPermissions.push(newPerm);
            console.log(`Permission ${perm.name} created`);
        } else {
            createdPermissions.push(existingPerm);
        }
    }
    return createdPermissions;
};

async function setupInitialData() {
    try {
        // Create permissions first
        await createPermissions();

        for (const roleData of rolesAndPermissions) {
            const existingRole = await Role.findOne({ roleName: roleData.roleName });
            if (!existingRole) {
                const role = new Role({
                    roleName: roleData.roleName,
                    description: roleData.description,
                    permissions: [] 
                });
                await role.save();
                console.log(`${roleData.roleName} role created`);

                // Create permissions for the role
                for (const permissionName of roleData.permissions) {
                    let permission = await Permission.findOne({ name: permissionName });
                    if (permission) {
                        role.permissions.push(permission._id); 
                    }
                }
                await role.save(); 
            }
        }

        // Check if admin user exists
        const adminUser   = await User.findOne({ email: 'admin@example.com' }); // Change to your desired admin email
        if (!adminUser  ) {
            const adminRole = await Role.findOne({ roleName: 'Admin' }); 
            const hashedPassword = await bcrypt.hash('admin123', 10); 
            const user = new User({
                username: 'admin',
                email: 'admin@example.com', // Change to your desired admin email
                password: hashedPassword, 
                role: adminRole.roleName 
            });
            await user.save();
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Error seeding initial data:', error);
    } finally {
        mongoose.connection.close();
    }
}

connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        return setupInitialData(); 
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });