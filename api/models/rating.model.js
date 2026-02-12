import {  Model, DataTypes } from 'sequelize';
import 'dotenv/config';
import { sequelize } from './sequelize.client.js';

class Rating extends Model {};

Rating.init(
  {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min:1,
        max:5
      }
    }
  },
  { 
    sequelize,
    modelName: "Rating",
    tableName: "rating",
    timestamps: true,
    // Pour préciser que chaque duo recipe/user valeur dans Rating ne peut exister qu'une fois
    indexes: [
      {
        unique:true,
        fields: ["user_id","recipe_id"]
      }
    ]
  }
);

export default Rating;