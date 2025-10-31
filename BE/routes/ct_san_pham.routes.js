import express from 'express';
var router = express.Router();
import ct_san_phamController from '../controllers/ct_san_pham.controller.js';

router.get('/', ct_san_phamController.getAll);
router.get('/:id', ct_san_phamController.getById);
router.post('/', ct_san_phamController.insert);
router.put('/:id', ct_san_phamController.update);
router.delete('/:id', ct_san_phamController.delete);

export default router;
