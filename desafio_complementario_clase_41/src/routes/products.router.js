import { Router } from "express";
import { isAuthenticated, isUser } from "../middleware/auth.js";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";

const router = Router();

router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:pid", updateProduct);
router.delete("/products/:pid", deleteProduct);
router.get("/products/:pid", getProductById);

export default router;