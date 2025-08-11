const app = require('./src/app');
const { syncDatabase } = require('./src/config/database');
const { testEmailConfig } = require('./src/services/emailService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Import models to ensure they are loaded
require('./src/models/User');
require('./src/models/UserDetails');
require('./src/models/Gallery');
require('./src/models/Project');
require('./src/models/Consultation');
require('./src/models/Review');
require('./src/models/Notification');

// Import model associations
require('./src/models/associations');

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Sync database (create tables if they don't exist)
    await syncDatabase(false); // Set to true to force recreate tables
    
    // Test email configuration
    const emailConfigValid = await testEmailConfig();
    if (!emailConfigValid) {
      console.warn('⚠️  Email configuration is invalid. Email features may not work.');
    }

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 DecorVista API Server Started Successfully!

📍 Server Details:
   • Port: ${PORT}
   • Environment: ${process.env.NODE_ENV || 'development'}
   • Database: ${process.env.DB_NAME || 'decorvista_db'}
   • Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

🔗 API Endpoints:
   • Health Check: http://localhost:${PORT}/health
   • Authentication: http://localhost:${PORT}/api/v1/auth
   • API Documentation: http://localhost:${PORT}/api/docs

📧 Email Configuration: ${emailConfigValid ? '✅ Valid' : '❌ Invalid'}

🛡️  Security Features:
   • CORS Protection: Enabled
   • Rate Limiting: Enabled
   • Helmet Security Headers: Enabled
   • Input Validation: Enabled

Ready to accept connections! 🎉
      `);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`\n📡 Received ${signal}. Starting graceful shutdown...`);
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        
        console.log('✅ Server closed successfully');
        console.log('🔌 Database connections closed');
        console.log('👋 DecorVista API shutdown complete');
        process.exit(0);
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('💥 Uncaught Exception:', err);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('💥 Unhandled Promise Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();