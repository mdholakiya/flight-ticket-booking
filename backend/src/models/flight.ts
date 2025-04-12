import { Model, DataTypes, Sequelize } from 'sequelize';

interface FlightAttributes {
  id: number;
  flightNumber: string;
  flightName?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
  classType: 'Economy' | 'Business Class' | 'First Class';
  createdAt?: Date;
  updatedAt?: Date;
}

export class Flight extends Model<FlightAttributes> implements FlightAttributes {
  declare id: number;
  declare flightNumber: string;
  declare flightName: string;
  declare departureAirport: string;
  declare arrivalAirport: string;
  declare departureTime: Date;
  declare arrivalTime: Date;
  declare price: number;
  declare availableSeats: number;
  declare classType: 'Economy' | 'Business Class' | 'First Class';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize) {
    Flight.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        flightNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        flightName: {
          type: DataTypes.STRING,
          allowNull: false, // match what you did in migration
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
        classType: {
          type: DataTypes.ENUM('Economy', 'Business Class', 'First Class'),
          allowNull: false,
          defaultValue: 'Economy'
        }
      },
      {
        sequelize,
        modelName: 'Flight',
        tableName: 'Flights',
        underscored: false,
        timestamps: true
      }
    );
  }
}

export default Flight; 