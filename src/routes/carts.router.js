// src/routes/carts.router.js
import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// POST /api/carts/ => crear carrito
router.post("/", async (_req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/carts/:cid => listar productos del carrito
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/carts/:cid/product/:pid => agregar producto (incrementa quantity si existe)
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const qty = Number(req.body?.quantity) || 1;
    const cart = await cartManager.addProduct(req.params.cid, req.params.pid, qty);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.status(201).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
