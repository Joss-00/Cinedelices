import { User, Recipe, Comment, Rating } from "../models/index.js";
import HttpError from "../utils/HttpError.js";
import BaseController from "./base.controller.js";

import jwt from "jsonwebtoken";
import argon2 from "argon2";
import "dotenv/config";

class AuthController extends BaseController {

  constructor() {
    super(User, 'user')
  };
  
  // Enregistrement utilisateur
  registerUser = async (req, res, next) => {
    try {
      const dataJson = req.body;
      const userByUsername = await User.findOne({
        where: { username: dataJson.username },
      });
      const userByEmail = await User.findOne({
        where: { email: dataJson.email },
      });

      if (userByUsername || userByEmail) {
        throw new HttpError("User already exists", 409);
      }

      // Calculer le hash du mot de passe
      const hash = await argon2.hash(dataJson.password);
      const newUser = await User.create({
        username: dataJson.username,
        email: dataJson.email,
        password: hash,
        role: "user",
      });

      if (!newUser) {
        const errorNotFound = new HttpError(`Aucun utilisateur créé`, 500);
        throw errorNotFound;
      }
      // Si l'enregistrement a réussi renvoyer l'utilisateur avec un code 201
      res.status(201).json({
        id : newUser.id
      });
    } catch (error) {
      next(error);
    }
  };

  // Connexion utilisateur
  login = async (req, res, next) => {
    try {
      const dataJson = req.body;
      const userByEmail = await User.findOne({
        where: { email: dataJson.email },
      });
      if (!userByEmail) {
        throw new HttpError("login ou mot de passe incorrect", 401);
      }

      // Vérifier si le mot de passe de l'utilisateur correspond au hash mis dans la BDD
      if (!(await argon2.verify(userByEmail.password, dataJson.password))) {
        // Le mot de passe ne correspond pas !
        throw new HttpError("login ou mot de passe incorrect", 401);
      }

      // Créer le token avec l'id de l'utilisateur
      // process.env.JWT_SECRET ==> va chercher le secret qui est dans .env
      const token = jwt.sign(
        // Les données à mettre dans le token
        {
          user_id: userByEmail.id,
          role: userByEmail.role,
        },
        // Le secret pour calculer le token
        process.env.JWT_SECRET, // Le secret que j'ai découvert de l'API
        // Date d'expiration du token : le token expire dans une heure !
        {
          expiresIn: "1h",
        },
      );
      res.status(200).json({ 
        token,
        user:{ 
          role: userByEmail.role,
          username: (userByEmail.username)
        }});
    } catch (error) {
      next(error);
    }
  };

  // Recupérer infos utilisateur
  getMe = async (req, res, next) => {
    try {
      // Récupère l'ID de l'utilisateur ajouté par le middleware validateToken
      // Il a été ajouté dans req par le middleware validateToken
      const userId = req.user_id;
      const user = await User.findByPk(userId, {
        attributes: ["id", "username", "email"],
        include: [
          {
            model: Comment,
            as: "comment",
            attributes: [ "content" ],
            include: [
              {
                model: Recipe,
                as: "recipe",
                attributes: [ "title" ],
                include: [
                  {
                    model: Rating,
                    as: "rating",
                    attributes: [ "value" ],
                    where: { user_id: userId },
                    required:false
                  }
                ]
              },
            ],
          },
          {
            model: Recipe,
            as: "recipe",
            attributes: [ "title", "id" ]
          }
        ],
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}

const myController = new AuthController();
export default myController;
