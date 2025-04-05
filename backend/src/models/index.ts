import { Sequelize } from 'sequelize';
import Flight from './flight.js';
import Booking from './booking.js';
import User from './user.js';

export const initModels = (sequelize: Sequelize) => {
  // Initialize models
  Flight.initModel(sequelize);
  Booking.initModel(sequelize);
  User.initModel(sequelize);

  // Define associations
  Booking.belongsTo(Flight, { foreignKey: 'flightId' });
  Flight.hasMany(Booking, { foreignKey: 'flightId' });

  Booking.belongsTo(User, { foreignKey: 'userId' });
  User.hasMany(Booking, { foreignKey: 'userId' });

  return {
    Flight,
    Booking,
    User
  };
};

export { Flight, Booking, User }; 