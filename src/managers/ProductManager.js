// src/managers/ProductManager.js
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "../../data/products.json");

export default class ProductManager {
  constructor(filePath = DATA_PATH) {
    this.filePath = filePath;
  }

  async #read() {
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(raw || "[]");
    } catch (e) {
      if (e.code === "ENOENT") {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, "[]");
        return [];
      }
      throw e;
    }
  }

  async #write(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }

  async getAll() {
    return await this.#read();
  }

  async getById(id) {
    const items = await this.#read();
    return items.find(p => String(p.id) === String(id)) || null;
  }

  async create(payload) {
    const required = ["title", "description", "code", "price", "status", "stock", "category"];
    for (const field of required) {
      if (payload[field] === undefined) {
        const err = new Error(`Falta el campo requerido: ${field}`);
        err.status = 400;
        throw err;
      }
    }

    const items = await this.#read();

    // evitar code duplicado (opcional, pero útil)
    if (items.some(p => p.code === payload.code)) {
      const err = new Error(`Ya existe un producto con code='${payload.code}'`);
      err.status = 409;
      throw err;
    }

    const newId = items.length ? (Number(items[items.length - 1].id) + 1) : 1;

    const product = {
      id: newId,
      title: String(payload.title),
      description: String(payload.description),
      code: String(payload.code),
      price: Number(payload.price),
      status: Boolean(payload.status),
      stock: Number(payload.stock),
      category: String(payload.category),
      thumbnails: Array.isArray(payload.thumbnails) ? payload.thumbnails.map(String) : []
    };

    items.push(product);
    await this.#write(items);
    return product;
  }

  async update(id, updates) {
    const items = await this.#read();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return null;

    // proteger id
    const { id: _ignore, ...rest } = updates || {};

    items[idx] = { ...items[idx], ...rest };
    await this.#write(items);
    return items[idx];
  }

  async delete(id) {
    const items = await this.#read();
    const idx = items.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return false;
    items.splice(idx, 1);
    await this.#write(items);
    return true;
  }
}
