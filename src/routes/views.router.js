// src/routes/views.router.js
import { Router } from 'express';
import mongoose from 'mongoose';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';

const router = Router();
const { Types } = mongoose;

/**
 * "/" → redirige a "/products"
 */
router.get('/', (_req, res) => {
  res.redirect('/products');
});

/**
 * GET /products
 * Vista con todos los productos + paginación
 * Si viene ?cid=... lo usamos como "carrito activo"
 */
router.get('/products', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort,
      query,
      cid // carrito activo opcional
    } = req.query;

    const filter = {};

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
      page: parseInt(page),
      limit: parseInt(limit),
      sort: Object.keys(sortOption).length ? sortOption : undefined,
      lean: true
    };

    const result = await ProductModel.paginate(filter, options);

    res.render('home', {
      title: 'Productos',
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      totalPages: result.totalPages,
      limit,
      sort,
      query,
      cartId: cid || null // carrito activo (si vino por query)
    });
  } catch (error) {
    console.error('Error en GET /products (vista):', error);
    res.status(500).send('Error al cargar productos');
  }
});

/**
 * GET /products/:pid
 * Vista de detalle de un producto
 */
router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const { cid } = req.query;

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).send('ID de producto inválido');
    }

    const product = await ProductModel.findById(pid).lean();

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetail', {
      title: product.title,
      product,
      cartId: cid || null
    });
  } catch (error) {
    console.error('Error en GET /products/:pid (vista):', error);
    res.status(500).send('Error al cargar el detalle del producto');
  }
});

/**
 * POST /products/:pid/delete
 * Elimina un producto y redirige a la lista
 */
router.post('/products/:pid/delete', async (req, res) => {
  try {
    const { pid } = req.params;
    const { cid } = req.body; // carrito activo opcional para mantenerlo

    if (!Types.ObjectId.isValid(pid)) {
      return res.status(400).send('ID de producto inválido');
    }

    await ProductModel.findByIdAndDelete(pid);

    const redirectUrl = cid ? `/products?cid=${cid}` : '/products';
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error en POST /products/:pid/delete (vista):', error);
    res.status(500).send('Error al eliminar producto');
  }
});

/**
 * GET /realtimeproducts
 * Vista con formulario + listado
 */
router.get('/realtimeproducts', async (_req, res) => {
  try {
    const products = await ProductModel.find().lean();
    res.render('realTimeProducts', {
      title: 'Realtime',
      products
    });
  } catch (error) {
    console.error('Error en GET /realtimeproducts (vista):', error);
    res.status(500).send('Error al cargar productos en tiempo real');
  }
});

/**
 * POST /realtimeproducts
 * Crea un producto desde el formulario del menú
 */
router.post('/realtimeproducts', async (req, res) => {
  try {
    const data = req.body;

    await ProductModel.create({
      title: data.title,
      description: data.description,
      code: data.code,
      price: Number(data.price),
      stock: Number(data.stock),
      category: data.category,
      status: data.status !== 'false',
      thumbnails: []
    });

    res.redirect('/realtimeproducts');
  } catch (error) {
    console.error('Error en POST /realtimeproducts (vista):', error);
    res.status(500).send('Error al crear producto desde el formulario');
  }
});

/**
 * GET /carts
 * Lista todos los carritos y permite crear uno nuevo
 */
router.get('/carts', async (_req, res) => {
  try {
    const carts = await CartModel.find().lean();
    res.render('carts', {
      title: 'Carritos',
      carts
    });
  } catch (error) {
    console.error('Error en GET /carts (vista lista):', error);
    res.status(500).send('Error al cargar carritos');
  }
});

/**
 * POST /carts/create
 * Crea un carrito nuevo desde la vista
 */
router.post('/carts/create', async (_req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.redirect(`/carts/${newCart._id}`);
  } catch (error) {
    console.error('Error en POST /carts/create (vista):', error);
    res.status(500).send('Error al crear carrito');
  }
});

/**
 * GET /carts/:cid
 * Vista de un carrito con populate
 */
router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    if (!Types.ObjectId.isValid(cid)) {
      return res.status(400).send('ID de carrito inválido');
    }

    const cart = await CartModel.findById(cid)
      .populate('products.product')
      .lean();

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('cart', {
      title: `Carrito ${cid}`,
      cartId: cid,
      products: cart.products
    });
  } catch (error) {
    console.error('Error en GET /carts/:cid (vista):', error);
    res.status(500).send('Error al cargar carrito');
  }
});

/**
 * POST /carts/:cid/products/:pid (vistas)
 * Agrega un producto al carrito y redirige a la vista del carrito
 */
router.post('/carts/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const quantity = parseInt(req.body.quantity || '1', 10);

    if (!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(pid)) {
      return res.status(400).send('ID de carrito o producto inválido');
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    const existingItem = cart.products.find(p => p.product.toString() === pid);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error en POST /carts/:cid/products/:pid (vista):', error);
    res.status(500).send('Error al agregar producto al carrito');
  }
});

/**
 * POST /carts/:cid/products/:pid/delete
 * Elimina un producto del carrito desde la vista
 */
router.post('/carts/:cid/products/:pid/delete', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    if (!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(pid)) {
      return res.status(400).send('ID de carrito o producto inválido');
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error en POST /carts/:cid/products/:pid/delete (vista):', error);
    res.status(500).send('Error al eliminar producto del carrito');
  }
});

/**
 * POST /carts/:cid/empty
 * Vacía el carrito desde la vista
 */
router.post('/carts/:cid/empty', async (req, res) => {
  try {
    const { cid } = req.params;

    if (!Types.ObjectId.isValid(cid)) {
      return res.status(400).send('ID de carrito inválido');
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    cart.products = [];
    await cart.save();

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('Error en POST /carts/:cid/empty (vista):', error);
    res.status(500).send('Error al vaciar carrito');
  }
});

export default router;
