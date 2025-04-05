import { Sequelize } from 'sequelize';
import Flight from './flight.js';
import Booking from './booking.js';

export const initModels = (sequelize: Sequelize) => {
  // Initialize models
  Flight.initModel(sequelize);
  Booking.initModel(sequelize);

  // Define associations
  Booking.belongsTo(Flight, { foreignKey: 'flightId' });
  Flight.hasMany(Booking, { foreignKey: 'flightId' });

  return {
    Flight,
    Booking
  };
};

export { Flight, Booking }; 