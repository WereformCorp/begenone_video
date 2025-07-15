const { dbConnect } = require("lib_user_db-begenone");
const dotenv = require("dotenv");

const path = require("path");
const app = require("./app");

dotenv.config({ path: path.join(__dirname, "./config.env") });

console.log("PATH:", path.join(__dirname, "./config.env"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

// Environment Variables
const {
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_CLUSTER,
  DATABASE,
  DATABASE_OPTIONS,
} = process.env;

// Validate and connect
try {
  const DB_URI = `mongodb+srv://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_CLUSTER}/${DATABASE}?${DATABASE_OPTIONS}`;
  dbConnect(
    DB_URI,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_CLUSTER,
    DATABASE,
    DATABASE_OPTIONS,
  );
} catch (error) {
  console.error("❌ Error initializing database:", error.message);
  process.exit(1);
}

// Microservice runs on PORT 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 DB Service running on port ${PORT}`));

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  process.exit(1);
});
