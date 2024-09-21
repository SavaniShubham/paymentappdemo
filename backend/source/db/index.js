import mongoose from "mongoose";

const connectionDB = async () => {

    const connectionURL = process.env.CONNECTION_URL;

    if (!connectionURL) {
        console.error("Database connection URL is not defined in environment variables. Please check your .env file or environment configuration.");
        process.exit(1);
    }
    try {
        const connectionInstance = await mongoose.connect(connectionURL);
        console.log("Successfully connected to MongoDB");
        // console.log(connectionInstance);
        console.log(`Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); 
    }
};

export default connectionDB;
