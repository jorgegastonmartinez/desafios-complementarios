import { Router } from "express";
const router = Router();

import {
    createCart,
    getCartById,
    updateCart,
    deleteCart
} from '../controllers/cart.controller.js'; 


router.post('/carts', createCart);
router.get('/carts/:id', getCartById);
router.put('/carts/:id', updateCart);
router.delete('/carts/:id', deleteCart);

export default router;

