# Work-Order-Application-React
### In Development
A Work Order Software Cross Platform Application. This application links customer and business communication for work-order maintenance, creation and status.


## Target Audience
As communication is paramount to business success, the streamlining of work order management is critical for small and large operations to maintain a competitive advantage, and ensure important tasks are managed. This application is targeted for business applications that involve work orders to track and schedule tasks.


## Application Outline
Full stack Application using MERN stack framework.

## Demo
This project demo was deployed on Render and Mongo DB. 

### Backend Deployment
Server

https://work-order-application-react-backend.onrender.com

API Documentation
https://work-order-application-react-backend.onrender.com/api-docs

 

## Setup
    - Clone the repository

### Frontend Setup
- Step 1: Install Dependencies
```
npm install
```
- Step 2: Create a .env file in `frontend`
Add the URL for the backend server
```
VITE_BACKEND_URL=http://localhost:5000
```
### Backend Setup


    - cd into the backend
    - Install the required packages by running npm install in the project directory

```
npm install
```

- Create a `.env file` in the main project `backend` folder.

    For MONGODB_URI, use:
```
MONGODB_URI=mongodb://localhost:27017/yourdatabasehere
```
    If using a local database, no password is required. Replace 'yourdatabasehere' with your database name of choice.

    Fill in a Port for the project to run

    Create a JWT_SECRET. This can be anything but for more secure otion, run in the termial and copy the string to `your_generated_secret_here`
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
MONGODB_URI=mongodb://localhost:27017/yourdatabasehere
PORT=REPLACE_THIS_WITH_A_PORT
REACT_APP_ORIGIN=http://localhost:5173 # (default or replace with frontend server URL)
API_BASE_URL=https://your-production-url.com/api
JWT_SECRET=your_generated_secret_here
TEST_DB_URI=mongodb://your-database-uri-here
NODE_ENV=test
```
- navigate to the `backend/scripts` folder and run the setup.js script to populate initial roles and permissions into database
```
node setup.js
```

the default credentials can be changed in `/scripts/setup.js`

## Frontend
-	Employ React – Vite Framework with Tailwind CSS and Bootstrap
-	RESTFUL API for CRUD Applications integrated into App
-	Dashboard that contains and centralizes access to webpages
    -   User Authenticated Sessions – JWT or Session Token
    -   Link to User Profile and Permissions including
        -   Role
        -   Skill Set
        -   Contact Information
        -   Work Order History
        -   Schedule
        -   Notifications
-	Schedule Page
    -   Searchable functionality
    -   Overall Schedule
    -   Create A new Work Order
    -   Edit an Existing Work Order
    -	Delete A Work Order
    -	Preventative Maintenance tracker – involving templates to auto schedule
-	Pricing Page
    -	Searchable functionality
    -	Job known costs
    -	Material Costs and Availability
    -	Field for Custom Cost
-	Current Task List 
    -	Searchable functionality
    -	List view of current Tasks
    -	Edit/Delete Tasks
-	Resource Page
    -	Personnel Skills/ Availability
    -	Equipment
-	Reports
    -	Using library such as Plotly.js or d3 charts to display current trends/statistics of completion, timeliness, cost.
-	Customer Page
 

 ## Backend
-	Node.js 
-	API 
    -	User Profile
    -	Resource Profile
    -	Materials Availability and Cost
    -	Customer Information, billing, work orders
-	API documentation using swagger http://localhost:5000/api-docs/ or deployment server
-	Application testing using Mocha and/or Chai - WIP
-	Database – MongoDB 
    -	To store API data

### File Structure
```
Work-Order-Application-React/
└── backend/
    ├── config/
    │   ├── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── permissionController.js
    │   ├── pricelistController.js
    │   ├── reportController.js
    │   ├── roleController.js
    │   ├── taskController.js
    │   |── userController.js
    │   └── workOrderController.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   |── roleCheck.js
    │   └── swagger.js
    ├── models/
    │   ├── Pricelist.js
    │   ├── Role.js
    │   ├── Task.js
    │   ├── User.js
    │   ├── UserProfile.js
    │   └── WorkOrder.js
    ├── routes/
    │   ├── Auth/
    │   │   └── authRoutes.js
    │   ├── Permissions/
    │   │   └── permissionRoutes.js
    │   ├── Pricelist/
    │   │   └── priceListRoutes.js
    │   ├── Reports/
    │   │   └── reportRoutes.js
    │   ├── Roles/
    │   │   └── roleRoutes.js
    │   ├── Tasks/
    │   │   └── taskRoutes.js
    │   |── User/
    │   |   └── userRoutes.js
    |   └── WorkOrders/
    │       └── workOrderRoutes.js
    ├── scripts/
    │   └── setup.js
    ├── test/
    │   └── auth.test.js
    ├── utils/
    │   |── AppError.js
    │   └── tokenGenerator.js
    ├── .env
    ├── package.json
    └── server.js
```




    #### Error handling 
 If an unhandledRejection error occurs, it logs out the error and closes the server with an exit code of 1.

 
#### Models
- Permission Model
    - Define individual permissions that can be granted
- Role Model
    - Define roles and associates them with permissions
- User Model
    - Define users and associates them with permissions
- User Profile Model
    - Define user profiles and associates them with users
- Work Order Model
    - Define work orders and their associated tasks
- Task Model
    - Define tasks and their relationships to users and work orders
- Pricelist Model
    - Define pricing items and their details


## Testing (WIP)
To run your tests, ensure that the TEST_DB_URI is set correctly in your .env file. Then, execute the following commands: 
```
# Stop your tests (e.g., with Ctrl + C)
# Then run your tests again
npm test

# Stop the running server (if applicable)
# Then restart the server
npm start
```

### Hosting
The application can be hosted on platforms like Render and MongoDB Atlas.


### References 


https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/

https://dev.to/bushblade/add-eslint-to-a-react-vite-project-4pib

https://kdesign.co/blog/pastel-color-palette-examples/


https://code.daypilot.org/47819/react-work-order-planning-system-php-mysql

https://www.youtube.com/watch?v=PDWgxqOzvxo
Fullstack/MERN Stack Task Manager App

https://www.w3schools.com/jsreF/jsref_array_flatmap.asp

https://www.youtube.com/watch?v=T1RgT0Yh1Lg
https://d3js.org/

