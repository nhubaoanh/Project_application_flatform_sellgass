import express from 'express';
var router = express.Router();
import trang_thai_don_hangController from '../controllers/trang_thai_don_hang.controller.js';

router.get('/', trang_thai_don_hangController.getAll);
router.get('/:id', trang_thai_don_hangController.getById);
router.post('/', trang_thai_don_hangController.insert);
router.put('/:id', trang_thai_don_hangController.update);
router.delete('/:id', trang_thai_don_hangController.delete);

export default router;
