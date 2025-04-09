import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
  otp?: string | null;
  otp_expiry?: Date | null;
  reset_token?: string | null;
  reset_token_expiry?: Date | null;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare email: string;
  declare password: string;
  declare name: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare otp?: string | null;
  declare otp_expiry?: Date | null;
  declare reset_token?: string | null;
  declare reset_token_expiry?: Date | null;

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
          allowNull: true,
          field: 'otp'
        },
        otp_expiry: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'otp_expiry'
        },
        reset_token: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'reset_token'
        },
        reset_token_expiry: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'reset_token_expiry'
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at'
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at'
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
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