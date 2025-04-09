import { Model, DataTypes, Sequelize } from 'sequelize';


export class Booking extends Model {
  public id!: number;
  public flightId!: number;
  public userId!: number;
  public passengerName!: string;
  public passengerEmail!: string;
  public numberOfSeats!: number;
  public totalPrice!: number;
  public status!: 'pending' | 'confirmed' | 'cancelled';
  public classType!: 'Economy' | 'Business Class' | 'First Class';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
        }
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