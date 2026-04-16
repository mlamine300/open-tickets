import { Router } from 'express';
import { getNotCompleteReportBi, getOrganisationBi, getTicketReportForBi, getUsersBi } from '../controllers/biController.js';
const biRouter = Router();

// Example route
biRouter.get('/tickets',getTicketReportForBi );
biRouter.get('/notcomplete',getNotCompleteReportBi );
biRouter.get('/users',getUsersBi );
biRouter.get('/organisations',getOrganisationBi );


export default biRouter;