import {  Model, DataTypes } from 'sequelize';
import 'dotenv/config';
import { sequelize } from './sequelize.client.js';

class Media extends Model {};

Media.init(
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
    }
  },
  { 
    sequelize,
    modelName: "Media",
    tableName: "media",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

export default Media;