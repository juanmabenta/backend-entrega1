import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '..', '..', 'data', 'products.json');

async function ensureFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, '[]');
  }
}

export default class ProductManager {
  async _read() {
    await ensureFile();
    try {
      const raw = await fs.readFile(dataFile, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  async _write(data) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getAll() { return this._read(); }

  async add(product) {
    const products = await this._read();
    const id = (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());
    const newProd = { id, ...product };
    products.push(newProd);
    await this._write(products);
    return newProd;
  }

  async deleteById(id) {
    const products = await this._read();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const [removed] = products.splice(idx, 1);
    await this._write(products);
    return removed;
  }
}
