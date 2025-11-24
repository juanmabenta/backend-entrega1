# Entrega Backend – Productos y Carritos con MongoDB

Proyecto de backend en **Node.js + Express** que implementa un pequeño e-commerce con:

- Gestión de **productos** en MongoDB usando **Mongoose** y paginación.
- Gestión de **carritos** con productos referenciados.
- Vistas en **Handlebars** para navegar y probar la API.
- Vista de **productos en tiempo real** usando WebSockets (/realtimeproducts).

---

## 🛠 Tecnologías usadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose (+ mongoose-paginate)
- Handlebars (express-handlebars)
- Socket.io
- Dotenv
- Nodemon (para desarrollo)

---

## 📁 Estructura principal del proyecto

- `server.js` → Punto de entrada del servidor Express.
- `src/models/product.model.js` → Modelo Mongoose de productos.
- `src/models/cart.model.js` → Modelo Mongoose de carritos.
- `src/routes/products.router.js` → Rutas API para productos (`/api/products`).
- `src/routes/carts.router.js` → Rutas API para carritos (`/api/carts`).
- `src/routes/views.router.js` → Rutas de vistas Handlebars.
- `src/views/` → Plantillas Handlebars:
  - `home.handlebars` → Listado de productos con paginación.
  - `productDetail.handlebars` → Detalle de un producto.
  - `realTimeProducts.handlebars` → Alta de productos en tiempo real.
  - `carts.handlebars` → Listado de carritos.
  - `cart.handlebars` → Detalle de un carrito.

---

## 🔐 Variables de entorno

En la raíz del proyecto se utiliza un archivo `.env` para la configuración.

Ejemplo:

```env
PORT=8081
MONGO_URL=tu_string_de_conexion_de_mongo
