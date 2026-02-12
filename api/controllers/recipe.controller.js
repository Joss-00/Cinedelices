import { Recipe, Comment, Rating, Media, Category, User } from "../models/index.js";
import BaseController from "./base.controller.js";
import HttpError from '../utils/HttpError.js';
import { Op } from 'sequelize'
import { RecipeCheck } from "../utils/llm.js";

class RecipeController extends BaseController {
  constructor() {
    super(Recipe, "recipe");
  }

  // Récupération de tout les infomations liée à une recette
  getAllInfoByIdRecipe = async (req, res, next) => {
    try {
      const recipeId = req.params.id;
      const result = await Recipe.findByPk(recipeId, {
        include: [
          {
            model: Comment,
            as: "comment",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "username"], 
              },
            ],
          },
          { model: Rating, as: "rating" },
          { model: Media,
              as: "media",
              attributes: ["id", "title"] 
            },
        ],
        order: [[{ model: Comment, as: "comment" }, "created_at", "DESC"]],
      });
      
      // Recupération du titre du média
      const media = result.media.title
      // Calcul de la moyenne de la recette
      const allRating = result.rating;
      // Addition de toutes les notes
      let total = 0;
      for (let rating of allRating) {
        total += rating.value;
      }
      // Calcul de la moyenne
      const average = Math.round((total / allRating.length) * 10) / 10;
      const numberRating = allRating.length;
      const recipe = result.toJSON();
      // On supprime tout les notes car on en a pas besoin
      delete recipe.rating;
      
      res.status(200).json({ ...recipe, average, numberRating, media });
    } catch (error) {
      next(error);
    }
  };

  // Ajout d'un commentaire recette
  createCommentsByIdRecipe = async (req, res, next) => {
    const recipeId = req.params.id;
    const userId = req.user_id;
    const { content } = req.body;
    const newElement = await Comment.create({
      content: content,
      recipe_id: recipeId,
      user_id: userId,
    });
    res.status(200).json(newElement);
  };

  // Moyenne d'une recette
  getAverageRatingByIdRecipe = async (req, res, next) => {
    try {
      const recipeId = req.params.id;
      const result = await Rating.findAll({
        where: { recipe_id: recipeId },
      });
      // Addition de toutes les notes
      let total = 0;
      for (let rating of result) {
        total += rating.value;
      }
      // Calcul de la moyenne
      const average = Math.round((total / result.length) * 10) / 10;
      res.status(200).json(average);
    } catch (error) {
      next(error);
    }
  };

  // Ajout d'une recette dans la bdd
  addRecipe = async (req, res, next) => {

    // Verification du média (s'il existe déja)
    try {
      const dataJson = req.body;

      let resultMedia = await Media.findOne(
        {
          where: { title: dataJson.media }
        }
      );
      // Si pas trouvé on le crée
      if (resultMedia === null){
        resultMedia = await Media.create({
          title : dataJson.media,
          type: dataJson.mediaType
        })
      } 
      const mediaId = resultMedia.id;
    
      // Verification de la catégorie
      const resultCategory = await Category.findOne(
        {
          where: { name: dataJson.category }
        }
      );

      // IA nettoyage de la recette
      const recipeToCheck = {
          title: dataJson.title,
          description: dataJson.description,
          ingredients: dataJson.ingredients,
          instructions: dataJson.instructions,
          anecdote: dataJson.anecdote,
        }
      
      const categoryId = resultCategory.id;
      const userId = req.user_id;
      const recipeChecked = await RecipeCheck(recipeToCheck);
      
       // Construction de la recette finale pour la BDD
      const newElement = await Recipe.create({
        ...recipeChecked,
        image_url: dataJson.image_url,
        category_id: categoryId,
        media_id: mediaId,
        user_id: userId
      })

      // NewElement est null ==> l'ajout de l'élément a échoué
      if (!newElement) {
        const errorNotFound = new HttpError(`Auncune recette crée`, 500);
        throw errorNotFound;
      }

      res.status(201).json(newElement);

    } catch (error) {
      next(error);
    }
  };

  // Ajout / mise à jour de la note
  addRating = async (req, res) => {
    const { value } = req.body;
    const recipeId = req.params.id;
    const userId = req.user_id;

    try {
      let rating = await Rating.findOne({
        where: { recipe_id: recipeId, user_id: userId },
      });

      if (rating) {
        rating.value = value;
        await rating.save();
      } else {
        rating = await Rating.create({
          value,
          recipe_id: recipeId,
          user_id: userId,
        });
      }

      res.status(201).json(rating);
    } catch (error) {
      next(error);
    }
  };

  // Récupeartion des recettes par catégorie
  getRecipesByCategory = async (req, res, next) => {
    try {
      const paramId = req.params.id;
      const results = await Recipe.findAll({
        where: { category_id: paramId },
      });
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  // Récupeartion des recettes par date d'ajout
  getRecipesByDate = async (_req, res, next) => {
    try {
      const results = await Recipe.findAll({
        order: [["created_at", "DESC"]],
      });
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };

  // Récupeartion des recettes par une recherche
  getRecipesBySearch = async (req, res, next) => {
    try {
      const search = req.body.search;
      const results = await Recipe.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { anecdote: { [Op.iLike]: `%${search}%` } },
            { ingredients: { [Op.iLike]: `%${search}%` } },
          ],
        },
        include: {
          model: Media,
          as: "media",
          required: false,
          where: { title: { [Op.iLike]: `%${search}%` } },
        },
      });
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  };
}

const myController = new RecipeController();
export default myController;
