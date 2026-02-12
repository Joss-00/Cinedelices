import Joi from "joi";
import HttpError from "../utils/HttpError.js";

// Schema du JSON attendu
export function validateRecipe(req, res, next) {
  const createRecipeSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null),
    image_url: Joi.string().allow("", null),
    ingredients: Joi.string().required(),
    instructions: Joi.string().required(),
    anecdote: Joi.string().allow("", null),
    media: Joi.string().required(),
    category: Joi.string().required(),
    mediaType: Joi.string().required(),
  });

  const validation = createRecipeSchema.validate(req.body);

  if (validation.error) {
    throw new HttpError(validation.error, 400);
  };
  next();
}
