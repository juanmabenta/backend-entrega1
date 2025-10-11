# API Productos & Carritos (Filesystem)

Node.js + Express (puerto **8080**), persistencia en archivos (`/data/products.json` y `/data/carts.json`).

## Rutas
### /api/products
- **GET /** → lista todos
- **GET /:pid** → producto por id
- **POST /** → crea (id autogenerado)
- **PUT /:pid** → actualiza (no modifica id)
- **DELETE /:pid** → elimina

### /api/carts
- **POST /** → crea carrito (id autogenerado)
- **GET /:cid** → lista productos del carrito
- **POST /:cid/product/:pid** → agrega producto (quantity incrementa)

## Correr
```bash
npm install
npm run dev
```

> Si los JSON no existen, se crean automáticamente.
