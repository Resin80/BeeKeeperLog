import { Router } from 'express';
import * as harvestController from '../controllers/harvestController';

const router = Router();

router.get('/', harvestController.getAllHarvests);
router.post('/', harvestController.createHarvest);

export default router;
