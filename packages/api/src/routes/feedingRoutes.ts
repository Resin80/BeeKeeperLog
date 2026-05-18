import { Router } from 'express';
import * as feedingController from '../controllers/feedingController';

const router = Router();

router.get('/', feedingController.getAllFeedings);
router.post('/', feedingController.createFeeding);

export default router;
