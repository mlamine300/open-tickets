import { Router } from 'express';
import {
  createNavette,
  updateNavette,
  deleteNavette,
  getNavettes,
  getNavetteById,
  searchNavette
} from '../controllers/navetteController.js';

const navetteRouter = Router();

// CRUD routes for navettes
navetteRouter.post('/', createNavette);
navetteRouter.post('/search/list', searchNavette);
navetteRouter.put('/:id', updateNavette);
navetteRouter.delete('/:id', deleteNavette);
navetteRouter.get('/', getNavettes);
navetteRouter.get('/:id', getNavetteById);

export default navetteRouter;