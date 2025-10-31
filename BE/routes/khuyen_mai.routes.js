import express from 'express';
var router = express.Router();
import khuyen_maiController from '../controllers/khuyen_mai.controller.js';

router.get('/', khuyen_maiController.getAll);
router.get('/:id', khuyen_maiController.getById);
router.post('/', khuyen_maiController.insert);
router.put('/:id', khuyen_maiController.update);
router.delete('/:id', khuyen_maiController.delete);

export default router;
