import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cm = new CartManager();

router.get('/', async (_req, res) => {
  const carts = await cm.getAll();
  res.json({ status: 'ok', payload: carts });
});

export default router;
