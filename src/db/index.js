import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        const mongooseInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MONGO DB IS CONNECTED || DB HOST: ${mongooseInstance.connection.host}`)
        console.log('\n info: 📑 Visit the documentation at: http://localhost:8000/doc')
    }
    catch(error){
        console.log("MongoDB Connection error",error);
        process.exit(1);
    }
}

export default connectDB;
