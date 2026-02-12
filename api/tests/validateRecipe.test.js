import { describe, it } from "node:test";
import assert from "node:assert";
import { validateRecipe } from "../middlewares/recipe.middleware.js";
import HttpError from "../utils/HttpError.js";

describe("validateRecipe middleware", () => {

  it("Recette valide", () => {
    const req = {
      body: {
        title: "Pizza",
        description: "Bonne pizza",
        image_url: "image.jpg",
        ingredients: "fromage, tomate",
        instructions: "Cuire",
        anecdote: "Moment émouvant du film",
        media: "Nom De Film",
        category: "Plat",
        mediaType: "Film",
      },
    };

    let nextCalled = false;
    const next = () => {
      nextCalled = true;
    };

    validateRecipe(req, {}, next);

    assert.equal(nextCalled, true);
  });

  it("Recette invalide (title manquant)", () => {
    const req = {
      body: {
        image_url: "image.jpg",
        ingredients: "fromage",
        instructions: "Cuire",
        media: "Film",
        category: "Plat",
        mediaType: "movie",
      },
    };

    assert.throws(
      () => validateRecipe(req, {}, () => {}),
      HttpError
    );
  });

});
