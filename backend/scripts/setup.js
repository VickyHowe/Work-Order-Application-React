/**
 * *Seed Script to populate the database with initial data.
 */

require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const UserProfile = require("../models/UserProfile");
const WorkOrder = require("../models/WorkOrder");
const Task = require("../models/Task");
const Pricelist = require("../models/Pricelist");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");

// Define roles
const roles = [
  {
    name: "admin",
    canAssign: ["*"],
    permissions: [{ resource: "*", action: "*" }],
  },
  {
    name: "manager",
    canAssign: ["employee", "customer"],
    permissions: [
      { resource: "tasks", action: "manage" },
      { resource: "roles", action: "view" },
      { resource: "roles", action: "assign" },
      { resource: "profile", action: "view" },
      { resource: "profile", action: "update" },
      { resource: "pricelist", action: "create" },
      { resource: "pricelist", action: "view" },
      { resource: "pricelist", action: "update" },
      { resource: "pricelist", action: "delete" },
      { resource: "workorder", action: "create" },
      { resource: "workorder", action: "view" },
      { resource: "workorder", action: "update" },
      { resource: "workorder", action: "delete" },
      { resource: "report", action: "view" },
    ],
  },
  {
    name: "employee",
    canAssign: [],
    permissions: [
      { resource: "tasks", action: "view" },
      { resource: "profile", action: "update" },
      { resource: "workorder", action: "view" },
      { resource: "report", action: "view" },
    ],
  },
  {
    name: "customer",
    canAssign: [],
    permissions: [
      { resource: "pricelists", action: "view" },
      { resource: "profile", action: "update" },
      { resource: "workorder", action: "create" },
      { resource: "workorder", action: "view" },
    ],
  },
];

// Define users
const users = [
  {
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    securityQuestion: "What is your mother's maiden name?",
    securityQuestionAnswer: "Smith",
    role: "admin",
    isGolden: true,
  },
  {
    username: "manager",
    email: "manager@example.com",
    password: "manager123",
    securityQuestion: "What is your favorite color?",
    securityQuestionAnswer: "Blue",
    role: "manager",
    isGolden: true,
  },
  {
    username: "employee",
    email: "employee@example.com",
    password: "employee123",
    securityQuestion: "What is your pet's name?",
    securityQuestionAnswer: "Buddy",
    role: "employee",
    isGolden: true,
  },
  {
    username: "customer",
    email: "customer@example.com",
    password: "customer123",
    securityQuestion: "What is your mother's maiden name?",
    securityQuestionAnswer: "Johnson",
    role: "customer",
    isGolden: true,
  },
];

// Define pricelist items
const pricelistItems = [
  {
    itemName: "Edge Sharpening",
    price: 20,
    description: "Sharpen the edges of skis or snowboards.",
    createdBy: null,
  },
  {
    itemName: "Waxing",
    price: 15,
    description: "Apply wax to skis or snowboards for better glide.",
    createdBy: null,
  },
  {
    itemName: "Base Repair",
    price: 50,
    description: "Repair cracks or damage to the base of skis or snowboards.",
    createdBy: null,
  },
];

/**
 * Generates a random date within a specified range.
 */
const generateRandomDate = (startDate, endDate) => {
  return new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );
};

/**
 * Generates work orders and tasks.
 */
const generateWorkOrdersAndTasks = (numWorkOrders, numTasks) => {
  const workOrders = [];
  const tasks = [];
  const services = [
    "Edge Sharpening",
    "Waxing",
    "Base Repair",
    "Ski Tune-Up",
    "Snowboard Repair",
  ];
  const statuses = ["completed", "in-progress", "pending"];

  // Generate work orders
  for (let i = 0; i < numWorkOrders; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const workOrder = {
      title: `Work Order ${i + 1}`,
      description: `Description for work order ${i + 1}.`,
      status: status,
      assignedTo: null, // To be assigned later
      createdBy: null,
      deadline: generateRandomDate(
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      ), // Random deadline within a year
      completedAt:
        status === "completed"
          ? generateRandomDate(
              new Date(),
              new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            )
          : null,
      isOnTime: status === "completed" ? Math.random() > 0.5 : null,
      priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      predefinedServices: [
        services[Math.floor(Math.random() * services.length)],
      ],
      customerComments: [],
      internalComments: [],
      attachments: [],
      resources: [],
      tasks: [],
    };
    workOrders.push(workOrder);
  }

  // Generate tasks
  for (let i = 0; i < numTasks; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const task = {
      title: `Task ${i + 1}`,
      description: `Description for task ${i + 1}.`,
      status: status,
      user: null, // To be assigned later
      deadline: generateRandomDate(
        new Date(),
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      ), // Random deadline within a year
      completedAt:
        status === "completed"
          ? generateRandomDate(
              new Date(),
              new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            )
          : null,
      isOnTime: status === "completed" ? Math.random() > 0.5 : null,
      resources: [],
      createdBy: null,
      workOrder: null,
    };
    tasks.push(task);
  }

  return { workOrders, tasks };
};

// Generate work orders and tasks
const { workOrders, tasks } = generateWorkOrdersAndTasks(50, 25); // 50 work orders and 25 tasks

/**
 * Seeds roles into the database.
 *
 * This function checks if each role already exists and creates it if not.
 */
const seedRoles = async () => {
  for (const roleData of roles) {
    const existingRole = await Role.findOne({ name: roleData.name });
    if (!existingRole) {
      console.log("Creating role:", roleData);
      const role = new Role(roleData);
      await role.save();
      console.log(`Role '${roleData.name}' created successfully.`);
    } else {
      console.log(`Role '${roleData.name}' already exists.`);
    }
  }
};

/**
 * Seeds users into the database.
 *
 * This function checks if each user already exists and creates it if not.
 */
const seedUsers = async () => {
  for (const userData of users) {
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      console.log(`${userData.username} already exists.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const hashedSecurityQuestionAnswer = await bcrypt.hash(
      userData.securityQuestionAnswer,
      10
    );

    const role = await Role.findOne({ name: userData.role });
    if (!role) {
      console.error(
        `Role '${userData.role}' not found for user ${userData.username}. Please ensure roles are seeded before users.`
      );
      continue;
    }

    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      securityQuestion: userData.securityQuestion,
      securityQuestionAnswer: hashedSecurityQuestionAnswer,
      role: role._id,
    });

    await newUser.save();
    console.log(`User  '${userData.username}' created successfully.`);
  }
};

/**
 * Seeds pricelist items into the database.
 *
 * This function creates new pricelist items for the application.
 */
const seedPricelist = async () => {
  for (const itemData of pricelistItems) {
    const newItem = new Pricelist(itemData);
    await newItem.save();
    console.log(`Pricelist item '${itemData.itemName}' created successfully.`);
  }
};

/**
 * Seeds work orders into the database.
 *
 * This function creates new work orders and assigns users to them.
 */
const seedWorkOrders = async () => {
  for (const workOrderData of workOrders) {
    const newWorkOrder = new WorkOrder(workOrderData);
    // Assign a random user to the work order
    const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
    if (randomUser.length > 0) {
      newWorkOrder.assignedTo = randomUser[0]._id; // Assign a random user
    }
    await newWorkOrder.save();
    console.log(`Work Order '${workOrderData.title}' created successfully.`);
  }
};

/**
 * Seeds tasks into the database.
 *
 * This function creates new tasks and assigns users to them.
 */
const seedTasks = async () => {
  for (const taskData of tasks) {
    const newTask = new Task(taskData);
    // Assign a random user to the task
    const randomUser = await User.aggregate([{ $sample: { size: 1 } }]);
    if (randomUser.length > 0) {
      newTask.user = randomUser[0]._id; // Assign a random user
    }
    await newTask.save();
    console.log(`Task'${taskData.title}' created successfully.`);

    // If the task is linked to a work order, update the work order's tasks array
    if (taskData.workOrder) {
      await WorkOrder.findByIdAndUpdate(
        taskData.workOrder,
        { $push: { tasks: newTask._id } },
        { new: true }
      );
      console.log(
        `Task'${taskData.title}' added to Work Order '${taskData.workOrder}'.`
      );
    }
  }
};

// Connect to the database
connectDB();

/**
 * Seeds the database with roles, users, pricelist items, work orders, and tasks.
 *
 * This function orchestrates the seeding process for the application.
 */
const seedDatabase = async () => {
  await seedRoles();
  await seedUsers();
  await seedPricelist();
  await seedWorkOrders();
  await seedTasks();
  console.log("Database seeding completed.");
};

// Execute the seeding process
seedDatabase()
  .then(() => {
    console.log("Seeding process finished successfully.");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    mongoose.connection.close();
  });
