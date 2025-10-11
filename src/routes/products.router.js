// src/routes/products.router.js
import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// GET /api/products/
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAll();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/products/
router.post("/", async (req, res) => {
  try {
    const created = await productManager.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

// PUT /api/products/:pid (no se puede actualizar/eliminar id)
router.put("/:pid", async (req, res) => {
  try {
    const updated = await productManager.update(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const ok = await productManager.delete(req.params.pid);
    if (!ok) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ status: "deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
