'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check if columns exist
      const flightsColumns = await queryInterface.describeTable('Flights');
      const bookingsColumns = await queryInterface.describeTable('Bookings');

      // Step 1: Handle Flights table
      if (!flightsColumns.flightName) {
        await queryInterface.addColumn('Flights', 'flightName', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction });
      }

      // Update all flight names
      await queryInterface.sequelize.query(`
        UPDATE "Flights"
        SET "flightName" = CONCAT('Flight ', "flightNumber")
        WHERE "flightName" IS NULL;
      `, { transaction });

      // Step 2: Handle Bookings table
      if (!bookingsColumns.flightName) {
        // First add the column allowing nulls
        await queryInterface.addColumn('Bookings', 'flightName', {
          type: Sequelize.STRING,
          allowNull: true
        }, { transaction });
      }

      // Update all booking flight names
      await queryInterface.sequelize.query(`
        UPDATE "Bookings" b
        SET "flightName" = COALESCE(
          (
            SELECT CONCAT('Flight ', f."flightNumber")
            FROM "Flights" f
            WHERE b."flightId" = f.id
          ),
          'Unknown Flight'
        );
      `, { transaction });

      // Now that all records have values, set allowNull: false
      await queryInterface.changeColumn('Bookings', 'flightName', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check if columns exist
      const flightsColumns = await queryInterface.describeTable('Flights');
      const bookingsColumns = await queryInterface.describeTable('Bookings');

      // Remove columns if they exist
      if (bookingsColumns.flightName) {
        await queryInterface.removeColumn('Bookings', 'flightName', { transaction });
      }
      if (flightsColumns.flightName) {
        await queryInterface.removeColumn('Flights', 'flightName', { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}; 