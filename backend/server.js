require('dotenv').config({
  path: './.env'
});
const express = require("express");
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

/**
* Import Routes
*/
const authRoute = require('./routes/Auth/authRoutes'); 
const userRoute = require('./routes/User/userRoutes'); 
const permissionRoute = require('./routes/Permissions/permissionRoutes'); 
const roleRoute = require('./routes/Roles/roleRoutes'); 
const errorHandler = require('./middleware/errorHandler');
const taskRoute = require('./routes/Tasks/taskRoutes'); 
const pricelistRoute = require('./routes/Pricelist/priceListRoutes');

/**
* General Setup
*/
const app = express();
const port = process.env.PORT || 5000;

/**
* Middleware
*/
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));


/**
* Middleware
*/
app.use(cors());
app.use(express.json());

/**
* Connect to Database
*/
connectDB();

/**
* Connect Paths
*/
app.use(express.static(path.join(__dirname, 'public')));

/**
* Routes
*/
app.use("/api/auth", authRoute); 
app.use("/api/users", userRoute);
app.use("/api/permissions", permissionRoute); 
app.use("/api/roles", roleRoute); 
app.use("/api", roleRoute); 
app.use("/api/tasks", taskRoute); 
app.use("/api/pricelist", pricelistRoute);

app.listen(port, () => console.log(`Server running on port ${port}`));

// Handling Error
app.use(errorHandler);