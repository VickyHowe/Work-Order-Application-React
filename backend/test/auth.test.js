const mongoose = require('mongoose');
const chai = require('chai');
const request = require('supertest');
const app = require('../server'); 
const Role = require('../models/Role'); 
const { expect } = chai;

describe('Auth Routes', function () {
  this.timeout(15000); 

  before(async function () {

    console.log('Cleaning up the DB before running tests...');
    try {
      console.log('Connecting to the test database...');
      await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false, 
        connectTimeoutMS: 30000, 
        socketTimeoutMS: 30000, 
      });

      console.log('Database connected successfully');
      
      // Log the connection object to ensure it is valid
      console.log('Mongoose connection object:', mongoose.connection);

      // Drop the entire database before running tests to clean it
      console.log('Dropping the test database...');
      await mongoose.connection.db.dropDatabase();

      // Ensure the 'user' role exists before tests run
      const defaultRole = await Role.findOne({ name: 'user' });
      if (!defaultRole) {
        console.log('Creating default user role...');
        await Role.create({ name: 'user' });
      }

      console.log('App initialized and connected to the test database');
    } catch (error) {
      console.error('Error during before hook:', error);
      throw error; 
    }
  });

  after(async function () {
    console.log('Cleaning up after tests and closing DB connection...');
    await mongoose.disconnect(); 
  });

  describe('POST /api/auth/register', function () {
    it('should register a new user', async function () {
      const user = {
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com',
        role: 'user', // Make sure role is valid
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(201); // Expect status 201 for successful registration

      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('User registered successfully');
    });

    it('should return an error for missing fields', async function () {
      const user = {
        username: 'testuser',
        password: 'password123',
        // email is missing here
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(400); // Expect status 400 for missing fields

      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('All fields are required');
    });
  });

  describe('POST /api/auth/login', function () {
    it('should log in an existing user', async function () {
      const user = {
        username: 'testuser',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(200); // Expect status 200 for successful login

      expect(res.body.status).to.equal('success');
      expect(res.body.message).to.equal('Login successful');
    });

    it('should return an error for incorrect password', async function () {
      const user = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(401); // Expect status 401 for incorrect password

      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('Invalid password');
    });

    it('should return an error for non-existent user', async function () {
      const user = {
        username: 'nonexistentuser',
        password: 'password123',
      };

      const res = await request(app)
        .post('/api/auth/login')
        .send(user)
        .expect(401); // Expect status 401 for user not found

      expect(res.body.status).to.equal('error');
      expect(res.body.message).to.equal('User not found');
    });
  });
});
