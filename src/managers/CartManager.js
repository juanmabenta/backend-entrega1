import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '..', '..', 'data', 'carts.json');

async function ensureFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, '[]');
  }
}

export default class CartManager {
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
}
