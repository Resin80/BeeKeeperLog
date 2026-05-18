import { Router } from 'express';
import * as hiveController from '../controllers/hiveController';

const router = Router();

router.get('/', hiveController.getAllHives);
router.get('/:id', hiveController.getHiveById);
router.post('/', hiveController.createHive);
router.put('/:id', hiveController.updateHive);
router.delete('/:id', hiveController.deleteHive);

export default router;
