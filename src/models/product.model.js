// src/models/product.model.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  code: {
    type: String,
    unique: true,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String],
    default: []
  }
});

productSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model(productsCollection, productSchema);
