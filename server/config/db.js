// import mongoose from "mongoose";

// // Function to connect to the Mongodb database
// const connectDB = async () => {

//     mongoose.connection.on('connected', () => console.log('Database connected'))

//     await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
// }

// export default connectDB

import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "job-portal", // Chỉ định tên database thay vì thêm vào URI
        });

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
