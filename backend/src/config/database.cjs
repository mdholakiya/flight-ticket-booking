require('dotenv').config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'DESKTOP1',
  DB_NAME = 'flight_booking'
} = process.env;

module.exports = {
  development: {
    dialect: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  test: {
    dialect: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  },
  production: {
    dialect: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
};

// module.exports = config; 
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// export const sequelize = new Sequelize({
//   dialect: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432'),
//   username: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'DESKTOP1',
//   database: process.env.DB_NAME || 'flight_booking',
//   logging: false,
// });
// export default sequelize;