import Joi from 'joi';
import jwt from 'jsonwebtoken';

import 'dotenv/config';
import HttpError from '../utils/HttpError.js';
import { User } from '../models/index.js';

export function validateRegister(req, _res, next) {

	// Schema du JSON attendu
	const userSchema = Joi.object({
		username: Joi.string().alphanum().min(3).max(50).required(),
		email: Joi.string().email().max(255).required(),
		password: Joi.string().min(6).max(255).required()
	})
	const validation = userSchema.validate(req.body)

	if (validation.error) {
		// ERROR le JSON de la request n'est pas valide , elle sera attrapée par le middleware de gestion des erreurs
		throw new HttpError("login ou mot de passe invalides", 400);
	}
	next();
}

export function validatePassword(req, _res, next) {

	const userSchema = Joi.object({
		password: Joi.string().min(6).max(255).required()
	})
	const validation = userSchema.validate(req.body)

	if (validation.error) {
		// ERROR le JSON de la request n'est pas valide, elle sera attrapée par le middleware de gestion des erreurs
		throw new HttpError("Mot de passe invalides", 400);
	}
	next();
}

export function validateLogin(req, _res, next) {

	const userSchema = Joi.object({
		email: Joi.string().min(3).max(50).required(),
		password: Joi.string().min(6).max(255).required()
	})
	const validation = userSchema.validate(req.body)

	if (validation.error) {
		// ERROR le JSON de la request n'est pas valide, elle sera attrapée par le middleware de gestion des erreurs
		throw new HttpError("login ou mot de passe invalides", 400);
	}
	next();
}

export function validateToken(req, _res, next) {

	// Chercher le token qui est dans l'entête HTTP de la requete
	const bearerToken = req.headers.authorization;

	// Est-ce que bearerToken existe et commence par "Bearer "
	if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
		// Pas de authorization OU pas de bearer ==> erreur 401 unauthorized attrapée par le errorHandler	
		throw new HttpError("Authorization token missing or invalid", 401)
	}

	// Extraire le token de chaine de caractère
	// Index 0 du tableau : "Bearer"
	// Index 1 du tableau : le Token 
	const token = bearerToken.split(" ")[1];

	// 4. Utiliser JWT pour vérifier le token.
	jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

		// Token invalide => il a été modifié par le client ou il est expiré, etc.
		if (err) {
			console.log(err)
			throw new HttpError("Authorization token missing or invalid", 401)
		}
		// Ajout dans la requete (req) une nouvelle constante "user_id" qui contient l'id de l'utilisateur, extrait des valeurs du token et récupérable pour la suite 
		req.user_id = decoded.user_id;

		next();
	});
}

export async function isAdmin(req, _res, next) {
	try {
		// Récupérer l'utilisateur connecté avec son role vérifier qu'il soit admin
		// Si oui on laisse passer, sinon, rejeter la requête
		const userId = req.user_id;

		// Chercher dans la BDD l'utilisateur avec cet ID pour récupérer son rôle
		const user = await User.findByPk(userId)

		// role de l'utilisateur connecté
		const userRole = user.role;

		// Si l'utilisateur est admin on laisse passer, l'admin peut tout faire
		if ('admin' === userRole) {
			// Appeler le middleware suivant
			return next();
		}
		// Renvoyer une erreur 403 ,le role est insuffisant pour accéder à la ressource
		throw new HttpError("Forbidden request : Admin only",403)

	} catch (error) {
		next(error);
	}
}

