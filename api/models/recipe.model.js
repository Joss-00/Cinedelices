import { Model, DataTypes } from 'sequelize';
import 'dotenv/config';
import { sequelize } from './sequelize.client.js';

class Recipe extends Model {}

Recipe.init(
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    instructions:{
      type: DataTypes.TEXT,
      allowNull: false,
    },
    anecdote:{
      type: DataTypes.TEXT,
    }
  },
  {
    sequelize,
    modelName: "Recipe",
    tableName: "recipe",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default Recipe;