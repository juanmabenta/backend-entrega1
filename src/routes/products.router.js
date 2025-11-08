import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const all = await pm.getAll();
    const { limit } = req.query;
    const list = limit ? all.slice(0, Number(limit)) : all;
    res.json({ status: 'ok', payload: list });
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const all = await pm.getAll();
    const prod = all.find(p => p.id === req.params.pid);
    if (!prod) return res.status(404).json({ status: 'error', error: 'no existe' });
    res.json({ status: 'ok', payload: prod });
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, price } = req.body;
    if (!title || price == null) {
      return res.status(400).json({ status: 'error', error: 'title y price son obligatorios' });
    }
    const created = await pm.add({ title, price: Number(price) });

    const io = req.app.get('io');
    const products = await pm.getAll();
    io.emit('products:update', products);

    res.status(201).json({ status: 'ok', payload: created });
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const removed = await pm.deleteById(req.params.pid);
    if (!removed) return res.status(404).json({ status: 'error', error: 'no existe' });

    const io = req.app.get('io');
    const products = await pm.getAll();
    io.emit('products:update', products);

    res.json({ status: 'ok', payload: removed });
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

export default router;
