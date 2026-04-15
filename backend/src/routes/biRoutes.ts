import { Router } from 'express';
import { getTicketReportForBi } from '../controllers/biController.js';
const biRouter = Router();

// Example route
biRouter.get('/tickets',getTicketReportForBi );

export default biRouter;