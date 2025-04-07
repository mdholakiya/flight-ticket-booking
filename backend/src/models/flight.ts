import { Model, DataTypes, Sequelize } from 'sequelize';
export interface FlightAttributes {
  id: number;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
}

export class Flight extends Model<FlightAttributes> {
 id!: number;
 flightNumber!: string;
 departureAirport!: string;
 arrivalAirport!: string;
 departureTime!: Date;
 arrivalTime!: Date;
 price!: number;
 availableSeats!: number;
 readonly createdAt!: Date;
 readonly updatedAt!: Date;

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
        }
      },
      {
        sequelize,
        modelName: 'Flight',
        tableName: 'Flights'
      }
    );
  }
}

export default Flight; 