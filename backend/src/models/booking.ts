import { Model, DataTypes, Sequelize } from 'sequelize';
interface BookingAttributes {
  id: number;
  flightId: number;
  flightName: string;
  userId: number;
  passengerName: string;
  passengerEmail: string;
  numberOfSeats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  classType: 'Economy' | 'Business Class' | 'First Class';
}

export class Booking extends Model<BookingAttributes> implements BookingAttributes {
  declare id: number;
  declare flightId: number;
  declare flightName: string;
  declare userId: number;
  declare passengerName: string;
  declare passengerEmail: string;
  declare numberOfSeats: number;
  declare totalPrice: number;
  declare status: 'pending' | 'confirmed' | 'cancelled';
  declare classType: 'Economy' | 'Business Class' | 'First Class';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize) {
    Booking.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
         userId: { // Add this
          type: DataTypes.INTEGER,
          allowNull: false
        },
        flightId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        flightName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        passengerName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        passengerEmail: {
          type: DataTypes.STRING,
          allowNull: false
        },
        numberOfSeats: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
          defaultValue: 'pending'
        },
        classType: {
          type: DataTypes.ENUM('Economy', 'Business Class', 'First Class'),
          allowNull: false,
          defaultValue: 'Economy'
        },
      },
      
      {
        sequelize,
        modelName: 'Booking',
        tableName: 'Bookings',
        underscored: false,
        timestamps: true
      }
    );
  }
}

export default Booking; 