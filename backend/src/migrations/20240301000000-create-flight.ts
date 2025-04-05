import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      departureAirport: {
        type: DataTypes.STRING,
        allowNull: false
      },
      arrivalAirport: {
        type: DataTypes.STRING,
        allowNull: false
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      availableSeats: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('Flights');
  }
}; 