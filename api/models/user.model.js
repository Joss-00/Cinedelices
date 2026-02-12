import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize.client.js';

class User extends Model {};

User.init(
  {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "user"
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

export default User;