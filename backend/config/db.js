const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed.");
    console.error(`   Message: ${error.message}`);

    if (error.message.includes("ECONNREFUSED")) {
      console.error("\n💡 Troubleshooting:");
      console.error("   1. Make sure MongoDB Community Server is running");
      console.error("   2. Check if MongoDB service is started (Windows Services)");
      console.error("   3. Verify MongoDB is listening on port 27017");
      console.error("   4. Try connecting with MongoDB Compass: mongodb://127.0.0.1:27017\n");
    }

    process.exit(1);
  }
};

module.exports = connectDB;
