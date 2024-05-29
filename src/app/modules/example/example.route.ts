import { Router } from 'express';
import { ExampleController } from './example.controller';

const router = Router();

router.get('/', ExampleController.getExample);

export const ExampleRoutes = router;
