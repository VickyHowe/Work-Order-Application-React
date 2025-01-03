require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const UserProfile = require('../models/UserProfile');
const WorkOrder = require('../models/WorkOrder');
const Task = require('../models/Task');
const Pricelist = require('../models/Pricelist');
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
        role: 'admin'
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

// Define pricelist items
const pricelistItems = [
    {
        itemName: "Edge Sharpening",
        price: 20,
        description: "Sharpen the edges of skis or snowboards.",
        createdBy: null // Will be assigned to the manager
    },
    {
        itemName: "Waxing",
        price: 15,
        description: "Apply wax to skis or snowboards for better glide.",
        createdBy: null // Will be assigned to the manager
    },
    {
        itemName: "Base Repair",
        price: 50,
        description: "Repair cracks or damage to the base of skis or snowboards.",
        createdBy: null // Will be assigned to the manager
    }
];

// Define work orders
const workOrders = [
    {
        title: "Ski Tune-Up",
        description: "Full ski tune-up including edge sharpening and waxing.",
        status: "completed",
        assignedTo: null, // Will be assigned to an employee
        createdBy: null, // Will be assigned to a customer
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        completedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Completed 2 days before the deadline
        isOnTime: true, // Mark as completed on time
        priority: "medium",
        predefinedServices: ["Edge Sharpening", "Waxing"], // References to pricelist items
        customerComments: ["Please make sure the edges are sharp!"],
        internalComments: [],
        attachments: [],
        resources: ["Ski Gr inder", "Waxing Station"], // Resources for this work order
        tasks: [] // Will be populated with tasks
    },
    {
        title: "Snowboard Repair",
        description: "Repair a crack in the snowboard base.",
        status: "completed",
        assignedTo: null, // Will be assigned to an employee
        createdBy: null, // Will be assigned to a customer
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        completedAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Completed 1 day before the deadline
        isOnTime: true, // Mark as completed on time
        priority: "high",
        predefinedServices: ["Base Repair"], // References to pricelist items
        customerComments: ["The crack is near the tail."],
        internalComments: [],
        attachments: [],
        resources: ["Base Repair Kit"], // Resources for this work order
        tasks: [] // Will be populated with tasks
    },
    {
        title: "Ski Waxing",
        description: "Apply wax to the skis for better glide.",
        status: "pending",
        assignedTo: null,
        createdBy: null,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: "low",
        predefinedServices: ["Waxing"],
        customerComments: [],
        internalComments: [],
        attachments: [],
        resources: ["Waxing Station"],
        tasks: []
    },
    {
        title: "Snowboard Edge Sharpening",
        description: "Sharpen the edges of the snowboard.",
        status: "pending",
        assignedTo: null,
        createdBy: null,
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        priority: "medium",
        predefinedServices: ["Edge Sharpening"],
        customerComments: [],
        internalComments: [],
        attachments: [],
        resources: ["Ski Grinder"],
        tasks: []
    }
];

// Define tasks
const tasks = [
    {
        title: "Sharpen Edges",
        description: "Sharpen the edges of the skis.",
        status: "completed",
        user: null, // Will be assigned to an employee
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        completedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Completed 1 day after creation
        isOnTime: true, // Mark as completed on time
        resources: ["Ski Grinder"],
        createdBy: null,
        workOrder: null
    },
    {
        title: "Apply Wax",
        description: "Apply wax to the skis for better glide.",
        status: "completed",
        user: null,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        completedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Completed 1 day after creation
        isOnTime: true,
        resources: ["Waxing Station"],
        createdBy: null,
        workOrder: null
    },
    {
        title: "Inspect Snowboard",
        description: "Inspect the snowboard for any damages.",
        status: "pending",
        user: null,
        deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        resources: [],
        createdBy: null,
        workOrder: null
    },
    {
        title: "Repair Base",
        description: "Repair the base of the snowboard.",
        status: "pending",
        user: null,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        resources: ["Base Repair Kit"],
        createdBy: null,
        workOrder: null
    },
    {
        title: "Redress Stone for Grinder",
        description: "Maintenance task to redress the stone for the grinder.",
        status: "pending",
        user: null,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        resources: ["Grinder Maintenance Kit"],
        createdBy: null, // Not linked to a specific work order
        workOrder: null
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
        const existingUser  = await User.findOne({ username: userData.username });
        if (existingUser ) {
            console.log(`${userData.username} already exists.`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const hashedSecurityQuestionAnswer = await bcrypt.hash(userData.securityQuestionAnswer, 10);

        const role = await Role.findOne({ name: userData.role });
        if (!role) {
            console.error(`Role '${userData.role}' not found for user ${userData.username}. Please ensure roles are seeded before users.`);
            continue;
        }

        const newUser  = new User({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            securityQuestion: userData.securityQuestion,
            securityQuestionAnswer: hashedSecurityQuestionAnswer,
            role: role._id,
        });

        await newUser .save();
        console.log(`User  '${userData.username}' created successfully.`);
    }
};

// Function to seed pricelist items
const seedPricelist = async () => {
    for (const itemData of pricelistItems) {
        const newItem = new Pricelist(itemData);
        await newItem.save();
        console.log(`Pricelist item '${itemData.itemName}' created successfully.`);
    }
};

// Function to seed work orders
const seedWorkOrders = async () => {
    for (const workOrderData of workOrders) {
        const newWorkOrder = new WorkOrder(workOrderData);
        await newWorkOrder.save();
        console.log(`Work Order '${workOrderData.title}' created successfully.`);
    }
};

// Function to seed tasks
const seedTasks = async () => {
    try {
        const adminUser   = await User.findOne({ username: 'admin' });
        if (!adminUser  ) {
            console.error('Admin user not found. Please ensure the admin user is seeded before tasks.');
            return;
        }

        const workOrders = await WorkOrder.find();
        if (workOrders.length === 0) {
            console.error('No work orders found. Please ensure work orders are seeded before tasks.');
            return;
        }

        const tasks = [
            {
                title: "Sharpen Edges",
                description: "Sharpen the edges of the skis.",
                status: "completed",
                user: null,
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                completedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                isOnTime: true,
                resources: ["Ski Grinder"],
                createdBy: adminUser  ._id,
                workOrder: workOrders[0]._id
            },
            {
                title: "Apply Wax",
                description: "Apply wax to the skis for better glide.",
                status: "completed",
                user: null,
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                completedAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                isOnTime: true,
                resources: ["Waxing Station"],
                createdBy: adminUser  ._id,
                workOrder: workOrders[0]._id
            },
            {
                title: "Inspect Snowboard",
                description: "Inspect the snowboard for any damages.",
                status: "pending",
                user: null,
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                resources: [],
                createdBy: adminUser  ._id,
                workOrder: workOrders[1]._id
            },
            {
                title: "Repair Base",
                description: "Repair the base of the snowboard.",
                status: "pending",
                user: null,
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                resources: ["Base Repair Kit"],
                createdBy: adminUser  ._id,
                workOrder: workOrders[1]._id
            },
            {
                title: "Redress Stone for Grinder",
                description: "Maintenance task to redress the stone for the grinder.",
                status: "pending",
                user: null,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                resources: ["Grinder Maintenance Kit"],
                createdBy: adminUser   ._id,
                workOrder: null
            }
        ];

        for (const taskData of tasks) {
            const newTask = new Task(taskData);
            await newTask.save();
            console.log(`Task '${taskData.title}' created successfully.`);

            // If the task is linked to a work order, update the work order's tasks array
            if (taskData.workOrder) {
                await WorkOrder.findByIdAndUpdate(
                    taskData.workOrder,
                    { $push: { tasks: newTask._id } },
                    { new: true }
                );
                console.log(`Task '${taskData.title}' added to Work Order '${taskData.workOrder}'.`);
            }
        }
    } catch (error) {
        console.error('Error seeding tasks:', error);
    }
};

// Connect to the database
connectDB();

// Seed roles, users, pricelist, work orders, and tasks
(async () => {
    try {
        await seedRoles();
        await seedUsers();
        await seedPricelist();
        await seedWorkOrders();
        await seedTasks();
        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
})();