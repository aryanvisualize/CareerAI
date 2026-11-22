const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const mongoose = require("mongoose")

async function connectToDB(){
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MONGO_DB");
}

module.exports = connectToDB;
