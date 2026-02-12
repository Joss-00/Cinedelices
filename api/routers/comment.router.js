import { Router } from 'express';
import commentController from '../controllers/comment.controller.js'
import { isAdmin } from '../middlewares/auth.middleware.js';


const router = Router();

// Requêtes HTTP GET
router.get("/comments", commentController.getAllCommentByUserId);

router.delete("/comment/:id", isAdmin, commentController.delete);


export default router; 