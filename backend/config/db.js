import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DB Connected Successfully")
        })
        await mongoose.connect(process.env.MONGO_URI)
    }
    catch (err) {
        console.error("Error Connecting to MongoDB", err.message);
        process.exit(1) // exit the process
    }
}
export default connectDB;