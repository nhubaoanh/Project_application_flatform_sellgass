import express from 'express';
var router = express.Router();
import loai_san_phamController from '../controllers/loai_san_pham.controller.js';

router.get('/', loai_san_phamController.getAll);
router.get('/:id', loai_san_phamController.getById);
router.post('/', loai_san_phamController.insert);
router.put('/:id', loai_san_phamController.update);
router.delete('/:id', loai_san_phamController.delete);
router.get('/loaisanpham/:id', loai_san_phamController.getCategory);

export default router;
