import express from 'express';
var router = express.Router();
import hoa_don_nhapController from '../controllers/hoa_don_nhap.controller.js';

router.get('/', hoa_don_nhapController.getAll);
router.get('/:id', hoa_don_nhapController.getById);
router.post('/', hoa_don_nhapController.insert);
router.put('/:id', hoa_don_nhapController.update);
router.delete('/:id', hoa_don_nhapController.delete);

export default router;
