// import mongoose from "mongoose";

// // Function to connect to the Mongodb database
// const connectDB = async () => {

//     mongoose.connection.on('connected', () => console.log('Database connected'))

//     await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
// }

// export default connectDB


import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    mongoose.connection.on("connected", () => {
        console.log("Database connected");
        isConnected = true;
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default connectDB;
