import express from 'express';
var router = express.Router();
import ct_don_hangController from '../controllers/ct_don_hang.controller.js';

router.get('/', ct_don_hangController.getAll);
router.get('/:id', ct_don_hangController.getById);
router.post('/', ct_don_hangController.insert);
router.put('/:id', ct_don_hangController.update);
router.delete('/:id', ct_don_hangController.delete);

export default router;
