require("dotenv").config(); // Always load env first
const { Sequelize } = require("sequelize");

// Debug: confirm .env is loaded
console.log("Loaded DB Config:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "[HIDDEN]" : undefined,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 10000, // 10s timeout
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

// Test DB connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database.");
    console.error("Error details:", error.message);
    process.exit(1);
  }
};

// Sync DB models
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(`✅ Database ${force ? "forcefully " : ""}synchronized.`);
  } catch (error) {
    console.error("❌ Error synchronizing database:", error.message);
    throw error;
  }
};

// Initialize connection test
testConnection();

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
