require('dotenv').config({
    path: './.env'
  });
const express = require("express");
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
// const router = express.Router();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * Import Routes
 */
const notificationsRoutes = require('./routes/notifications');
const roleRoutes = require('./routes/role');
const scheduleRoutes = require('./routes/schedule');
const skillSetRoutes = require('./routes/skillSet');
const userProfileRoutes = require('./routes/userProfile');
const workOrderHistoryRoutes = require('./routes/workOrderHistory');


/**
 * Swagger definition
 */
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'WorkOrder API',
          version: '1.0.0',
          description: 'API documentation for work order application',
          contact: {
              name: 'Vicky Howe',
              email: 'vickyhowe@oracana.ca',
          },
      },
      servers: [
          {
              url: `http://localhost:${process.env.PORT || 5000}`, // change for deployment
          },
      ],
  },
  apis: ['./routes/*.js'], 
};



/**
 * General Setup
 */
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const app = express();
const port = process.env.PORT || 5000;


/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.use('/api/notifications', notificationsRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/skillsets', skillSetRoutes);
app.use('/api/userprofiles', userProfileRoutes);
app.use('/api/workorderhistories', workOrderHistoryRoutes);



app.listen(port, () => console.log(`server running on port ${port}`));