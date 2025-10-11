// src/managers/CartManager.js
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "../../data/carts.json");

export default class CartManager {
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

  async createCart() {
    const carts = await this.#read();
    const newId = carts.length ? (Number(carts[carts.length - 1].id) + 1) : 1;
    const cart = { id: newId, products: [] };
    carts.push(cart);
    await this.#write(carts);
    return cart;
  }

  async getCartById(cid) {
    const carts = await this.#read();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  async addProduct(cid, pid, qty = 1) {
    const carts = await this.#read();
    const idx = carts.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) return null;

    const cart = carts[idx];
    const itemIdx = cart.products.findIndex(p => String(p.product) === String(pid));
    if (itemIdx === -1) {
      cart.products.push({ product: String(pid), quantity: Number(qty) || 1 });
    } else {
      cart.products[itemIdx].quantity += Number(qty) || 1;
    }

    carts[idx] = cart;
    await this.#write(carts);
    return cart;
  }
}
