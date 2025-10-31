import express from 'express';
var router = express.Router();
import hang_tvController from '../controllers/hang_tv.controller.js';

router.get('/', hang_tvController.getAll);
router.get('/:id', hang_tvController.getById);
router.post('/', hang_tvController.insert);
router.put('/:id', hang_tvController.update);
router.delete('/:id', hang_tvController.delete);

export default router;
