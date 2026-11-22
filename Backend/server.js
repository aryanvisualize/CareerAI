require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./src/app");
const connectToDB = require("./src/config/database.js");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDB();

        const server = app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });

        server.on("error", (error) => {
            console.error("Failed to start server:", error.message);
            mongoose.disconnect().catch((disconnectError) => {
                console.error("Failed to close MongoDB connection:", disconnectError.message);
            }).finally(() => {
                process.exitCode = 1;
            });
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB; server was not started:", error.message);
        await mongoose.disconnect().catch((disconnectError) => {
            console.error("Failed to close MongoDB connection:", disconnectError.message);
        }).finally(() => {
            process.exitCode = 1;
        });
    }
}

startServer();
