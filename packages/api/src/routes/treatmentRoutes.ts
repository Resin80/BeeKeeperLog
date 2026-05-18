import { Router } from 'express';
import * as treatmentController from '../controllers/treatmentController';

const router = Router();

router.get('/', treatmentController.getAllTreatments);
router.post('/', treatmentController.createTreatment);

export default router;
