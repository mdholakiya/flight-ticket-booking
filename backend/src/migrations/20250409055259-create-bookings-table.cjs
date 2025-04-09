'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {  // <-- Add this
        type: Sequelize.INTEGER,
        allowNull: false
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      passengerName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      passengerEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numberOfSeats: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Bookings');
  }
};
