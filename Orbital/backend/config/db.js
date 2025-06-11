import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ellicitaffairs:acrobatics@cluster0.cb8gj6h.mongodb.net/foodforall').then(() => console.log("DB Connected"));
}