import {  Model, DataTypes } from 'sequelize';
import 'dotenv/config';
import { sequelize } from './sequelize.client.js';

class Category extends Model {};

Category.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  { 
    sequelize,
    modelName: "Category",
    tableName: "category",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

export default Category;