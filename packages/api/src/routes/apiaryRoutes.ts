import { Router } from 'express';
import * as apiaryController from '../controllers/apiaryController';

const router = Router();

router.get('/', apiaryController.getAllApiaries);
router.get('/:id', apiaryController.getApiaryById);
router.post('/', apiaryController.createApiary);
router.put('/:id', apiaryController.updateApiary);
router.delete('/:id', apiaryController.deleteApiary);

export default router;
