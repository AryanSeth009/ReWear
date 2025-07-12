const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://vedantbagwale3:rcA3RiYR32FqHsGi@rewear.fmxwymu.mongodb.net/?retryWrites=true&w=majority&appName=rewear";

async function createAdminUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db("rewear");
    
    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({ email: "admin@rewear.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const result = await db.collection("users").insertOne({
      email: "admin@rewear.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      points: 1000,
      rating: 5,
      isAdmin: true,
      createdAt: new Date(),
    });
    
    console.log("Admin user created successfully!");
    console.log("Email: admin@rewear.com");
    console.log("Password: admin123");
    console.log("User ID:", result.insertedId);
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await client.close();
  }
}

createAdminUser(); 