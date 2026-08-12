const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose")

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MONGO_DB");
    } catch (error) {
        console.log("Error connecting to MongoDB ", error.message);
    }
}

module.exports = connectToDB;