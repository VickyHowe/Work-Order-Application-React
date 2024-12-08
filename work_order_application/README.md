# Work-Order-Application-React
### In Development
A Work Order Software Cross Platform Application. This application links customer and business communication for work-order maintenance, creation and communication.


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
 
#### Backend
-	Node.js 
-	API 
    -	User Profile
    -	Resource Profile
    -	Materials Availability and Cost
    -	Customer Information, billing, work orders
-	API documentation using swagger
-	Application testing using Mocha and/or Chai
-	Database – MongoDB 
    -	To store API data


### Hosting
Render and MongoDB



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



MONGODB_URI = mongodb://localhost:27017/yourdatabasehere

PORT= REPLACE THIS WITH A PORT