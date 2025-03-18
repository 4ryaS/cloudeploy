import { Router } from 'express';
import deployApplication from '../controllers/appControllers';

const router = Router();

router.post('/deploy', deployApplication);

export default router;
