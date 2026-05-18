import { Router } from 'express';
import * as inspectionController from '../controllers/inspectionController';

const router = Router();

router.get('/', inspectionController.getAllInspections);
router.get('/:id', inspectionController.getInspectionById);
router.post('/', inspectionController.createInspection);
router.put('/:id', inspectionController.updateInspection);
router.delete('/:id', inspectionController.deleteInspection);

export default router;
