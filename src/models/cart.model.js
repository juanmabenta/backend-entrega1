// src/models/cart.model.js
import mongoose from 'mongoose';

const cartsCollection = 'carts';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // 👈 nombre de la colección de ProductModel
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

export const CartModel = mongoose.model(cartsCollection, cartSchema);
