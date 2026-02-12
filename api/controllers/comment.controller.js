import { Comment } from "../models/index.js";
import BaseController from "./base.controller.js";

class CommentController extends BaseController {

  constructor() {
    super(Comment, 'comment')
  };

  // Récupération des commentaires d'un utilisateur
  getAllCommentByUserId = async (req, res, next) => {
    try {
      const userId = req.user_id;
      const result = await Comment.findAll(
        {
          where: { user_id : userId }
        }
      );
      res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  }
};

const myController = new CommentController();
export default myController;