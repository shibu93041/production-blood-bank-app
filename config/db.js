const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connect To MongoDB Database ${mongoose.connection.host}`.bgYellow.black);

    }catch(error){
        console.log(`MongoDB Database error ${error}`.bgRed.white);
    }
};

module.exports = connectDB