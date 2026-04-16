import { Router } from 'express';
import { getNotCompleteReportBi, getTicketReportForBi } from '../controllers/biController.js';
const biRouter = Router();

// Example route
biRouter.get('/tickets',getTicketReportForBi );
biRouter.get('/notcomplete',getNotCompleteReportBi );

export default biRouter;