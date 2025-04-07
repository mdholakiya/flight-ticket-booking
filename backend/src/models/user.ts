import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  otp?: string | null;
  otpExpiry?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare name: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare otp?: string | null;
  declare otpExpiry?: Date | null;
  declare resetToken?: string | null;
  declare resetTokenExpiry?: Date | null;

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
        otp: {
          type: DataTypes.STRING,
          allowNull: true
        },
        otpExpiry: {
          type: DataTypes.DATE,
          allowNull: true
        },
        resetToken: {
          type: DataTypes.STRING,
          allowNull: true
        },
        resetTokenExpiry: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users'
      }
    );
  }

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    try {
      if (!this.password) {
        console.error('Password not set for user:', this.id);
        return false;
      }

      console.log('Comparing passwords for user:', this.id);
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      console.log('Password comparison result:', isMatch);
      
      return isMatch;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }
}

export default User; 