import  { sequelize }  from "../models/sequelize.client.js";
import { Recipe, Media, Category, User, Comment, Rating } from '../models/index.js';
import data from './data-examples.json' with { type: 'json' };
import argon2 from 'argon2';

async function seed() {
  console.log('Syncing database...');
  
  try {

    //éléments du JSON

    const recipes = data.recipes;
    const medias = data.medias;
    const categories = data.categories;
    const users = data.users;
    const comments = data.comments;
    const ratings = data.ratings;


    //Import des utilisateur

    for (const user of users) {
      const  hash = await argon2.hash(user.password);

      await User.create(
        {
          username: user.username,
          email: user.email,
          password: hash,
          role: user.role
        }
      );
    };


    //import des médias

    for (const media of medias) {
      await Media.create(media);
    };


    //import des catégories

    for (const category of categories) {
      await Category.create(category);
    };


    //import des recettes

    for (const recipe of recipes) {
      await Recipe.create(recipe);
    };


    //import des commentaires

    for (const comment of comments) {
      await Comment.create(comment);
    };


    //import des notes

    for (const rating of ratings) {
      await Rating.create(rating);
    }

    console.log('✅ Seeding complete!');

  } catch (error){
    console.log('Error seeding BDD', error);
  } finally {
    await sequelize.close();
  }
};

await seed();