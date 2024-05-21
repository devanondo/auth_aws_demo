import { Router } from 'express';
import { ExampleController } from './example.controller';

const router = Router();

router.get('/', ExampleController.getExample);
router.post('/', ExampleController.createExample);

export const ExampleRoutes = router;
