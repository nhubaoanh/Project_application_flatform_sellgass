import express from 'express';
var router = express.Router();
import ct_nhapController from '../controllers/ct_nhap.controller.js';

router.get('/', ct_nhapController.getAll);
router.get('/:id', ct_nhapController.getById);
router.post('/', ct_nhapController.insert);
router.put('/:id', ct_nhapController.update);
router.delete('/:id', ct_nhapController.delete);

export default router;
