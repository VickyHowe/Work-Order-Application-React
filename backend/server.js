require('dotenv').config({
    path: './.env'
  });
const express = require("express");
const router = express.Router()
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');



/**
 * Import Routes
 */
const authRoute = require('./routes/Auth/route')


/**
 * Swagger definition
 */



/**
 * General Setup
 */

const app = express();
const port = process.env.PORT || 5000;


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



app.listen(port, () => console.log(`server running on port ${port}`));

// Handling Error
process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
  })