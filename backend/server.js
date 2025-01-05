require("dotenv").config({
  path: "./.env",
});
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const origin = process.env.REACT_APP_ORIGIN;

/**
 * Import Routes
 */
const authRoute = require("./routes/Auth/authRoutes");
const userRoute = require("./routes/User/userRoutes");
const permissionRoute = require("./routes/Permissions/permissionRoutes");
const roleRoute = require("./routes/Roles/roleRoutes");
const errorHandler = require("./middleware/errorHandler");
const taskRoute = require("./routes/Tasks/taskRoutes");
const pricelistRoute = require("./routes/Pricelist/priceListRoutes");
const workOrderRoute = require("./routes/WorkOrders/workOrderRoutes");
const reportRoute = require("./routes/Reports/reportRoutes");
const { swaggerUi, swaggerDocs } = require("./middleware/swagger");

/**
 * General Setup
 */
const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware
 */
app.use(
  cors({
    origin: origin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
 * Swagger Configuration
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * Connect Paths
 */
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes
 */
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/permissions", permissionRoute);
app.use("/api/roles", roleRoute);
app.use("/api", roleRoute);
app.use("/api", userRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/pricelist", pricelistRoute);
app.use("/api/workorders", workOrderRoute);
app.use("/api/reports", reportRoute);

/**
 * Server
 */
app.listen(port, () => console.log(`Server running on port ${port}`));

/**
 * Error Handler
 */
app.use(errorHandler);

/**
 * Export App
 */
module.exports = app;
