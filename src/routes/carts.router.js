// src/routes/carts.router.js
import { Router } from 'express';
import mongoose from 'mongoose';
import { CartModel } from '../models/cart.model.js';
import { ProductModel } from '../models/product.model.js';

const router = Router();
const { Types } = mongoose;

/**
 * GET /api/carts
 */
router.get('/', async (_req, res) => {
  try {
    const carts = await CartModel.find().lean();
    res.json({ status: 'success', payload: carts });
  } catch (error) {
    console.error('Error en GET /api/carts:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener carritos' });
  }
});

/**
 * GET /api/carts/:cid
 */
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    if (!Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    console.error('Error en GET /api/carts/:cid:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener carrito' });
  }
});

/**
 * POST /api/carts
 */
router.post('/', async (_req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json({ status: 'success', payload: newCart });
  } catch (error) {
    console.error('Error en POST /api/carts:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear carrito' });
  }
});

/**
 * POST /api/carts/:cid/products/:pid
 */
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const existingItem = cart.products.find(p => p.product.toString() === pid);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();

    res.json({ status: 'success', message: 'Producto agregado al carrito', payload: cart });
  } catch (error) {
    console.error('Error en POST /api/carts/:cid/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito' });
  }
});

/**
 * PUT /api/carts/:cid
 */
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products || [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito actualizado', payload: cart });
  } catch (error) {
    console.error('Error en PUT /api/carts/:cid:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar carrito' });
  }
});

/**
 * PUT /api/carts/:cid/products/:pid
 */
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const item = cart.products.find(p => p.product.toString() === pid);
    if (!item) return res.status(404).json({ status: 'error', message: 'Producto no está en el carrito' });

    item.quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Cantidad actualizada', payload: cart });
  } catch (error) {
    console.error('Error en PUT /api/carts/:cid/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar cantidad' });
  }
});

/**
 * DELETE /api/carts/:cid/products/:pid
 */
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito o producto inválido' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Producto eliminado del carrito', payload: cart });
  } catch (error) {
    console.error('Error en DELETE /api/carts/:cid/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto del carrito' });
  }
});

/**
 * DELETE /api/carts/:cid
 */
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    if (!Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ status: 'error', message: 'ID de carrito inválido' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'Carrito vaciado', payload: cart });
  } catch (error) {
    console.error('Error en DELETE /api/carts/:cid:', error);
    res.status(500).json({ status: 'error', message: 'Error al vaciar carrito' });
  }
});

export default router;
