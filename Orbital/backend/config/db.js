import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://ellicitaffairs:acrobatics@cluster0.cb8gj6h.mongodb.net/foodforall', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB Connected`)
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}