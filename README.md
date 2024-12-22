# Work-Order-Application-React
### In Development
A Work Order Software Cross Platform Application. This application links customer and business communication for work-order maintenance, creation and status.


## Target Audience
As communication is paramount to business success, the streamlining of work order management is critical for small and large operations to maintain a competitive advantage, and ensure important tasks are managed. This application is targeted for business applications that involve work orders to track and schedule tasks.


### Application Outline
Full stack Application using MERN stack framework.
 

#### Frontend
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
 
## Frontend Setup
- Step 1: Install Dependencies
```
npm install
```
- Step 2: Create a .env file in `frontend`
Add the URL for the backend server
```
VITE_BACKEND_URL=http://localhost:5000
```



#### Backend
-	Node.js 
-	API 
    -	User Profile
    -	Resource Profile
    -	Materials Availability and Cost
    -	Customer Information, billing, work orders
-	API documentation using swagger http://localhost:5000/api-docs/
-	Application testing using Mocha and/or Chai
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




## Setup
    - Clone the repository

#### Backend Setup


    - cd into the backend
    - Install the required packages by running npm install in the project directory

```
npm install
```

- Create a `.env file` in the main project `backend` folder.

    for MONGODB_URI = mongodb://localhost:27017/yourdatabasehere As we are using a local database no password is required. Replace 'yourdatabasehere' with database name of choice.

    Fill in a Port for the project to run

    Create a JWT_SECRET. This can be anything but for more secure otion, run in the termial and copy the string to `your_generated_secret_here`
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```
MONGODB_URI = mongodb://localhost:27017/yourdatabasehere

PORT= REPLACE THIS WITH A PORT

JWT_SECRET=your_generated_secret_here
```
- navigate to the `backend/scripts` folder and run the setup.js script to populate initial roles and permissions into database
```
node setup.js
```
the default Admin credentials are;    
username: 'admin'
email: 'admin@example.com'
password: 'admin123'
These can be changed in `/scripts/setup.js`


### Hosting
Render and MongoDB


### References 
https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/

https://dev.to/bushblade/add-eslint-to-a-react-vite-project-4pib

