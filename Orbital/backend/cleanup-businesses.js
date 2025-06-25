import mongoose from "mongoose";
import "dotenv/config";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Cleanup function to remove userId field from businesses
const cleanupBusinesses = async () => {
  try {
    const db = mongoose.connection.db;
    const businessesCollection = db.collection('businesses');
    
    // Remove the userId field from all business documents
    const result = await businessesCollection.updateMany(
      {}, // match all documents
      { $unset: { userId: "" } } // remove the userId field
    );
    
    console.log(`Updated ${result.modifiedCount} business documents`);
    console.log("Successfully removed userId field from all businesses");
    
    // Also drop the unique index on userId if it exists
    try {
      await businessesCollection.dropIndex("userId_1");
      console.log("Dropped userId index");
    } catch (error) {
      console.log("userId index doesn't exist or already dropped");
    }
    
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the cleanup
connectDB().then(() => {
  cleanupBusinesses();
}); 