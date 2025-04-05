import { Model, DataTypes, Sequelize } from 'sequelize';

export class Flight extends Model {
  public id!: number;
  public flightNumber!: string;
  public departureAirport!: string;
  public arrivalAirport!: string;
  public departureTime!: Date;
  public arrivalTime!: Date;
  public price!: number;
  public availableSeats!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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