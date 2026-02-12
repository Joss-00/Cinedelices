import { Model, DataTypes } from "sequelize";
import "dotenv/config";
import { sequelize } from "./sequelize.client.js";


class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comment",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: true,
  },
);

export default Comment;
