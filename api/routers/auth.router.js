import { Router } from "express";
import authController from "../controllers/auth.controller.js"; 
import { validateLogin, validateRegister, validateToken, validatePassword } from "../middlewares/auth.middleware.js";

const router = Router();

// Requêtes HTTP POST
router.post('/auth/register', validateRegister, authController.registerUser);
router.post('/auth/login', validateLogin, authController.login);

// Requêtes HTTP GET
router.get('/auth/me', validateToken, authController.getMe);

export default router;
