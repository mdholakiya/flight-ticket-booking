import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = 'DESKTOP1',
  DB_NAME = 'flight_booking'
} = process.env;

const config: Options = {
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
};

const sequelize = new Sequelize(config);

// Export for Sequelize CLI
export const sequelizeConfig = {
  development: config,
  test: config,
  production: config
};

// Export for application use
export { sequelize };
export default sequelize;
