import "dotenv/config";
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    logging: false, // Ne pas afficher les requete sql en console
    define: {
      timestamps: true, // Ajouter les champs timestamps (par défaut à true)
      underscored: true, // Les noms de champs seront en snake_case
      createdAt: "created_at", 
      updatedAt: "updated_at"
    }
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
};
