# Work-Order-Application-React

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

### Frontend Deployment
Client
https://work-order-application-react-frontend.onrender.com 


### Demo Users
- Admin
    - username: "admin",
    - password: "admin123",

- Manager
    - username: "manager",
    - password: "manager123",

- Employee
    - username: "employee",
    - password: "employee123",
- Customer
    - username: "customer",
    - password: "customer123",



## Setup
    - Clone the repository https://github.com/VickyHowe/Work-Order-Application-React.git

### Frontend Setup
1. cd into the `frontend`
2. Install Dependencies
```
npm install
```
3. Create a .env file in `frontend` directory Add the URL for the backend server

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

## Frontend Features
- **Framework:** Built with React using Vite, Tailwind CSS, and Bootstrap.
- **RESTful API:** Integrated for CRUD operations.
- **Dashboard:** Centralized access to various webpages.
    - **User Authenticated Sessions:** JWT Token.
    - **User Profile:** Includes role, skill set, contact information, work order history, schedule, and notifications.
- **Schedule Page:**
    - Searchable functionality.
    - Overall schedule overview.
    - Create, edit, and delete work orders.
    - Preventative maintenance tracker with templates for auto-scheduling.
- **Pricing Page:**
    - Searchable functionality.
    - Job known costs and material costs with availability.
    - Field for custom cost.
- **Current Task List:**
    - Searchable functionality.
    - List view of current tasks with edit/delete options.
- **Resource Page:**
    - Personnel skills and availability.
    - Equipment management.
- **Reports:**
    - Utilizes libraries like Plotly.js or D3.js to display trends and statistics.
- **Customer Page:** Manage customer information and interactions.
 


 ## Backend Features
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


## Testing Plan
### Frontend Testing
1. **Unit Testig:**
    - Use Jest and React Testing Library to test individual components.
    - Ensure that components render correctly and handle props as expected.
2. **Integration Testing:**
    - Test interactions between components, such as form submissions and API calls.
    - Verify that the application state updates correctly in response to user actions.
3. **End-to-End Testing:**
    - Use Cypress to simulate user interactions with the application.
    - Test critical user flows, such as logging in, creating work orders, and navigating through the application.
4. **Accessibility Testing:**
    - Use tools like Axe or Lighthouse to ensure the application meets accessibility standards.
5. **Performance Testing:**
    - Use tools like Lighthouse to analyze the performance of the application and identify areas for improvement.

### Backend Testing
For this project I used Postman to test all routes, Future iterations will use Chai and Mocha Libraries.



To run your tests, ensure that the TEST_DB_URI is set correctly in your .env file. Then, execute the following commands: 
```
# Stop your tests (e.g., with Ctrl + C)
# Then run your tests again
npm test

# Stop the running server (if applicable)
# Then restart the server
npm start
```

### File Structure
This Full Stack Mern Application Follows the following structure to stay organized!

```
Work-Order-Application-React/
├── backend/
│   ├── config/
│   │   ├── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── permissionController.js
│   │   ├── pricelistController.js
│   │   ├── reportController.js
│   │   ├── roleController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── workOrderController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── error ```markdown
Handler.js
│   │   ├── roleCheck.js
│   │   └── swagger.js
│   ├── models/
│   │   ├── Pricelist.js
│   │   ├── Role.js
│   │   ├── Task.js
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   └── WorkOrder.js
│   ├── routes/
│   │   ├── Auth/
│   │   │   └── authRoutes.js
│   │   ├── Permissions/
│   │   │   └── permissionRoutes.js
│   │   ├── Pricelist/
│   │   │   └── priceListRoutes.js
│   │   ├── Reports/
│   │   │   └── reportRoutes.js
│   │   ├── Roles/
│   │   │   └── roleRoutes.js
│   │   ├── Tasks/
│   │   │   └── taskRoutes.js
│   │   ├── User/
│   │   │   └── userRoutes.js
│   │   └── WorkOrders/
│   │       └── workOrderRoutes.js
│   ├── scripts/
│   │   └── setup.js
│   ├── test/
│   │   └── auth.test.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── tokenGenerator.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminComponent.jsx
│   │   │   │   ├── ManagerComponent.jsx
│   │   │   │   ├── EmployeeComponent.jsx
│   │   │   │   └── CustomerComponent.jsx
│   │   │   ├── reports/
│   │   │   │   ├── D3Chart.jsx
│   │   │   │   ├── MetricCard.jsx
│   │   │   │   └── ReportsPage.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskDetails.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   └── TaskList.jsx
│   │   │   ├── user/
│   │   │   │   ├── UserProfile.jsx
│   │   │   │   └── UserManagement.jsx
│   │   │   ├── workOrders/
│   │   │   │   ├── WorkOrderCard.jsx
│   │   │   │   ├── WorkOrderDetails.jsx
│   │   │   │   ├── WorkOrderForm.jsx
│   │   │   │   └── WorkOrderList.jsx
│   │   │   ├── calendar/
│   │   │   │   └── CalendarView.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useApi.jsx
│   │   │   ├── useFetchPricelists.jsx
│   │   │   ├── useFetchWorkOrders.jsx
│   │   │   ├── useReports.jsx
│   │   │   └── useTasks.jsx
│   │   ├── index.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── tailwind.config.js
└── README.md
```

## Lessons Learned
- Express Route Handling: Gained experience in managing routes and middleware in Express.
- Project Structure: Learned how to structure a full-stack application for scalability and maintainability.
- API Integration: Improved skills in integrating frontend and backend through RESTful APIs.
- User Authentication: Gained insights into implementing JWT authentication for secure user sessions.
- State Management: Enhanced understanding of managing application state in React, especially with user authentication and data fetching.
- Learning Rect Hooks 
- Time Requirements of Application Development vs Planning
- How to handle different types of errors in a full-stack application

## Future Development
- Application Testing: Implement comprehensive testing strategies for both frontend and backend to ensure reliability and maintainability.
- User Roles and Permissions: Expand the role management system to include more granular permissions for different user types.
- Mobile Responsiveness: Improve the mobile experience by ensuring all components are fully responsive and user-friendly on smaller screens.
- Enhanced Reporting Features: Add more detailed reporting capabilities, including export options for reports in various formats (CSV, PDF).
- Real-time Notifications: Implement real-time notifications for users regarding work order updates and status changes.
- Integration with Third-party Services: Explore integrations with other tools and services, such as calendar applications or project management tools.

## References 

[www.blackboxai.com](https://www.blackbox.ai/)

[Node.js User Authentication Guide](https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/)

[Why you should add Eslint to a React Vite project ](https://dev.to/bushblade/add-eslint-to-a-react-vite-project-4pib)

[29 Beautiful Pastel Color Palette Examples with Color Codes](https://kdesign.co/blog/pastel-color-palette-examples/)


[React Work Order Planning System (PHP/MySQL)](https://code.daypilot.org/47819/react-work-order-planning-system-php-mysql)


[Fullstack/MERN Stack Task Manager App](https://www.youtube.com/watch?v=PDWgxqOzvxo)


[JavaScript Array flatMap()](https://www.w3schools.com/jsreF/jsref_array_flatmap.asp)

[D3 and React.js crash course](https://www.youtube.com/watch?v=T1RgT0Yh1Lg)

https://www.pexels.com/

https://d3js.org/

