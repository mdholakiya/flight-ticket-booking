'use strict';

/** @type {import('sequelize').QueryInterface} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const dummyNames = [
        'SkyJet Express',
        'AirNova',
        'CloudWing',
        'JetStream',
        'AeroLink',
        'FlyHigh',
        'Starlight Air',
        'Velocity Wings',
        'BlueHorizon',
        'Nimbus Airways'
      ];

      // Get all flights that don't have a name yet
      const flights = await queryInterface.sequelize.query(
        'SELECT id FROM "Flights" WHERE "flightName" IS NULL ORDER BY id ASC;',
        { type: Sequelize.QueryTypes.SELECT }
      );

      console.log(`Found ${flights.length} flights to update`);

      // Update each flight one by one to avoid conflicts
      for (let i = 0; i < flights.length; i++) {
        const nameIndex = i % dummyNames.length; // Use modulo to cycle through names if more flights than names
        await queryInterface.sequelize.query(
          'UPDATE "Flights" SET "flightName" = ? WHERE id = ? AND "flightName" IS NULL',
          {
            replacements: [dummyNames[nameIndex], flights[i].id],
            type: Sequelize.QueryTypes.UPDATE }
        );
      }

      console.log('Successfully updated flight names');
    } catch (error) {
      console.error('Error in seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'UPDATE "Flights" SET "flightName" = NULL WHERE "flightName" IS NOT NULL',
      { type: Sequelize.QueryTypes.UPDATE }
    );
  }
};
