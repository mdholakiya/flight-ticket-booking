import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import { initModels } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Initialize models
    initModels(sequelize);
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database & tables created!');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();