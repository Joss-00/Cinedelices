import Category from "./category.model.js";
import Recipe from "./recipe.model.js";
import User from "./user.model.js";
import Media from "./media.model.js";
import Comment from "./comment.model.js";
import Rating from "./rating.model.js";


// Cardinalité des tables

// RECIPE - USER
Recipe.belongsTo(User,
  {
    foreignKey: 'user_id',
    as:'user'
  }
);

User.hasMany(Recipe,
  {
    foreignKey: 'user_id',
    as: 'recipe'
  }
);

// RECIPE - CATEGORY
Recipe.belongsTo(Category,
  {
    foreignKey: 'category_id',
    as:'category'
  }
);

Category.hasMany(Recipe,
  {
    foreignKey: 'category_id',
    as: 'recipe'
  }
);

// RECIPE - MEDIA
Recipe.belongsTo(Media,
  {
    foreignKey: 'media_id',
    as: 'media'
  }
);

Media.hasMany(Recipe,
  {
    foreignKey: 'media_id',
    as: 'recipe'
  }
);

// COMMENT - RECIPE
Comment.belongsTo(Recipe,
  {
    foreignKey: "recipe_id",
    as: "recipe"
  }
);

Recipe.hasMany(Comment,
  {
    foreignKey: "recipe_id",
    as: "comment"
  }
);

// RATING - RECIPE
Rating.belongsTo(Recipe,
  {
    foreignKey: "recipe_id",
    as: "recipe"
  }
);

Recipe.hasMany(Rating,
  {
    foreignKey: "recipe_id",
    as: "rating"
  }
);

// USER -COMMENT
User.hasMany(Comment,
  {
    foreignKey: "user_id",
    as: "comment"
  }
);

Comment.belongsTo(User,
  {
    foreignKey:"user_id",
    as: "user"
  }
);

// RATING - USER
Rating.belongsTo(User,
  {
    foreignKey: "user_id",
    as: "user"
  }
);

User.hasMany(Rating,
  {
    foreignKey: "user_id",
    as: "rating"
  }
);



export { Recipe, Media, Category, User, Comment, Rating};