import HttpError from '../utils/HttpError.js';


export function validateId (req, _res, next) {

  const id = Number(req.params.id)
  
  if (!Number.isInteger(id) && id <= 0) {
    throw new HttpError('Id Invalid', 400);
  }
  
  next();
}