import { Router } from "express";
const router = Router();

import {
    createCart,
    getCartById,
    getAllCarts,
    deleteCart
} from '../controllers/cart.controller.js'; 


router.post('/carts', createCart);
router.get('/carts', getAllCarts);
router.get('/carts/:cartId', getCartById);
router.delete('/carts/:cartId', deleteCart);

export default router;

