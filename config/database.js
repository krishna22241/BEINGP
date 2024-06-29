// const mongoose = require("mongoose");
// require("dotenv").config();
// const dbConnect = () => {
//     mongoose.connect(process.env.DATABASE_URL)
//     .then(() => console.log("DB ka connection is successful"))
//     .catch( (error) => {
//         console.log("Issue in DB Connection");
//         console.error(error.message);
//         process.exit(1);//?
//     });
    

// }
// module.exports = dbConnect;
const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
        socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
    })
    .then(() => console.log("DB connection is successful"))
    .catch((error) => {
        console.log("Issue in DB Connection");
        console.error(error.message);
        process.exit(1);
    });

    // Enable Mongoose debug mode
    mongoose.set('debug', true);
};

module.exports = dbConnect;
