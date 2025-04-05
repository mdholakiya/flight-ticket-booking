import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export interface UserPreferences {
  seatPreference?: 'window' | 'aisle' | 'middle';
  mealPreference?: 'vegetarian' | 'non-vegetarian' | 'vegan';
  notificationPreferences?: {
    email?: boolean;
    sms?: boolean;
  };
}

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public name!: string;
  public preferences!: UserPreferences;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true
          }
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        preferences: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: {}
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        hooks: {
          beforeCreate: async (user: User) => {
            if (user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
          beforeUpdate: async (user: User) => {
            if (user.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          }
        }
      }
    );
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export default User; 