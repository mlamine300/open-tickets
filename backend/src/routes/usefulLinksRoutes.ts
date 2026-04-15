import { Router } from 'express';
import { createUsefulLinks, deactivateUsefulLinks, deleteUsefulLinks, fetchAllUsefulLinkss, getActiveUsefulLinkss, updateUsefulLinks } from '../controllers/useFulLinksController.js';
import { checkAdmin } from '../middlewares/authMiddleware.js';
const usefulLinksRouter = Router();

// Example route
usefulLinksRouter.get('/',getActiveUsefulLinkss );
usefulLinksRouter.get('/all',fetchAllUsefulLinkss );
usefulLinksRouter.post('/',checkAdmin,createUsefulLinks );
usefulLinksRouter.post('/update/:id',checkAdmin,updateUsefulLinks );
usefulLinksRouter.post('/delete/:id',checkAdmin,deleteUsefulLinks );
usefulLinksRouter.post('/deactivate/:id',checkAdmin,deactivateUsefulLinks );



export default usefulLinksRouter;