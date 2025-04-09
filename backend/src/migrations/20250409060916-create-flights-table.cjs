'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Flights', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      flightNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      departureAirport: {
        type: Sequelize.STRING,
        allowNull: false
      },
      arrivalAirport: {
        type: Sequelize.STRING,
        allowNull: false
      },
      departureTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      arrivalTime: {
        type: Sequelize.DATE,
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      availableSeats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      classType: {
        type: Sequelize.ENUM('Economy', 'Business Class', 'First Class'),
        allowNull: false,
        defaultValue: 'Economy'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Flights');
  }
};
