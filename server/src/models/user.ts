import { DataTypes, Sequelize, Model, Optional } from "sequelize";
import bcrypt from "bcrypt";

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;

  public async setPassword(password: string): Promise<void> {
    this.password = await bcrypt.hash(password, 10);
  }
}

export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      tableName: "users",
      sequelize,
      hooks: {
        beforeCreate: async (user: User) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user: User) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );
  
  return User;
}
