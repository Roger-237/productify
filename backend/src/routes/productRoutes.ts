import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

// Get all products
router.get("/", productController.getAllProducts);

// Get single product by ID
router.get("/:id", productController.getProductById);

// Create new product (protected)
router.post("/", requireAuth, productController.createProduct);

// Update product by ID (protected)
router.put("/:id", requireAuth, productController.updateProduct);

// Delete product by ID (protected)
router.delete("/:id", requireAuth, productController.deleteProduct);

export default router;