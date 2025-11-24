// src/routes/products.router.js
import { Router } from 'express';
import mongoose from 'mongoose';
import { ProductModel } from '../models/product.model.js';

const router = Router();
const { Types } = mongoose;

/**
 * GET /api/products
 * Soporta: limit, page, sort, query
 * Devuelve objeto con paginación + prevLink/nextLink
 */
router.get('/', async (req, res) => {
  try {
    let {
      limit = 10,
      page = 1,
      sort,
      query
    } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    const filter = {};

    // query: "category:Zapatillas" o "status:true"
    if (query) {
      const [field, value] = query.split(':');

      if (field === 'category') {
        filter.category = value;
      } else if (field === 'status') {
        filter.status = value === 'true';
      }
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const options = {
      page,
      limit,
      sort: Object.keys(sortOption).length ? sortOption : undefined,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    // Armamos prevLink y nextLink
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildLink = (targetPage) => {
      const params = new URLSearchParams();
      params.set('page', targetPage);
      params.set('limit', limit);
      if (sort) params.set('sort', sort);
      if (query) params.set('query', query);
      return `${baseUrl}?${params.toString()}`;
    };

    const prevLink = result.hasPrevPage ? buildLink(result.prevPage) : null;
    const nextLink = result.hasNextPage ? buildLink(result.nextPage) : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

/**
 * GET /api/products/:pid
 */
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const product = await ProductModel.findById(pid).lean();

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: product });
  } catch (error) {
    console.error('Error en GET /api/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
  }
});

/**
 * POST /api/products
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const created = await ProductModel.create(data);
    res.status(201).json({ status: 'success', payload: created });
  } catch (error) {
    console.error('Error en POST /api/products:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear producto' });
  }
});

/**
 * PUT /api/products/:pid
 */
router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const updated = await ProductModel.findByIdAndUpdate(pid, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: updated });
  } catch (error) {
    console.error('Error en PUT /api/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar producto' });
  }
});

/**
 * DELETE /api/products/:pid
 */
router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const deleted = await ProductModel.findByIdAndDelete(pid);

    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en DELETE /api/products/:pid:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar producto' });
  }
});

export default router;
