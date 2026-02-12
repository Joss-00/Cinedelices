import HttpError from '../utils/HttpError.js';

class BaseController {
  #model;
  #modelName;

  constructor (model, modelName) {
    this.#model = model;
    this.#modelName = modelName;
  };


  // Recupération de tout les données d'une table
  getAll = async (_req, res, next) => {

    try {
      const results = await this.#model.findAll();
      res.status(200).json(results);
    } catch (error) {
      next(error)
    }
  };

  // Recuperation d'une donnée en fonction de son id
  getById = async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await this.#model.findByPk(id);

      if (!result) {
				const errorNotFound = new HttpError(`${this.#modelName} Not Found`, 404);
				throw errorNotFound;
			}

			res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  };

  // Suppression d'un élément en fonction de son id
  delete = async (req, res, next) => {
		try {
			const id = req.params.id;
			const nbElementDestroyed = await this.#model.destroy(
				{ where: { id: id } }
			);

			// Aucune élément n'a été supprimées
			if (0 === nbElementDestroyed) {
				const errorNotFound = new HttpError(`${this.#modelName} Not Found`, 404);
				throw errorNotFound;
			}

			res.status(204).end();
		} catch (error) {
			next(error);
		}
	};

  // Ajout d'un nouvelle élément dans une table
  create = async (req, res, next) => {

		try {
			const dataJson = req.body;
			const newElement = await this.#model.create(dataJson);
			// newElement est null ==> l'ajoute de l'élément a échoué
			if (!newElement) {
				const errorNotFound = new HttpError(`Auncun ${this.#modelName} crée`, 500);
				throw errorNotFound;
			}
			
			res.status(201).json(newElement);
		} catch (error) {
			next(error);
		}
	};

  // Modification d'un élément dans la bdd
  update = async (req, res, next) => {

		try {
			const dataJson = req.body;
			const paramId = req.params.id;
			const result = await this.#model.update(dataJson,
				{
					where: { id: paramId },
					// Retourne l'objet modifié
					returning: true
				}
			)

			// Si aucune élément modifié, renvoie un 404
			if (0 === result[0]) {
				const errorNotFound = new HttpError(`Aucun ${this.#modelName} modifié`, 404);
				throw errorNotFound;
			}

			res.status(200).json(result[1][0]);
		} catch (error) {
			next(error);
		}
	};
}

export default BaseController;