const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URI);
        console.log(`Connection Successful to MongoDB: ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;