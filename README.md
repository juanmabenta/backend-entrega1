# Entrega Backend – Productos y Carritos con MongoDB

Proyecto de backend en **Node.js + Express** que implementa un pequeño e-commerce con:

- Gestión de **productos** en MongoDB usando **Mongoose** y paginación.
- Gestión de **carritos** con productos referenciados al modelo de productos.
- Vistas en **Handlebars** para navegar y probar la API desde el navegador.
- Vista de **productos en tiempo real** usando WebSockets (`/realtimeproducts`).

---

## 🛠 Tecnologías usadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose (+ mongoose-paginate-v2)
- Handlebars (express-handlebars)
- Socket.io
- Dotenv
- Nodemon (para desarrollo)

---

## 📁 Estructura principal del proyecto

- `server.js` → Punto de entrada del servidor Express. Conexión a MongoDB, configuración de vistas y Socket.io.
- `src/models/product.model.js` → Modelo Mongoose de productos + paginación.
- `src/models/cart.model.js` → Modelo Mongoose de carritos (con `products.product` referenciando al modelo `Product`).
- `src/routes/products.router.js` → Rutas API para productos (`/api/products`).
- `src/routes/carts.router.js` → Rutas API para carritos (`/api/carts`).
- `src/routes/views.router.js` → Rutas de vistas Handlebars para probar la app desde el navegador.
- `src/views/` → Plantillas Handlebars:
  - `home.handlebars` → Listado de productos con paginación.
  - `productDetail.handlebars` → Detalle de un producto.
  - `realTimeProducts.handlebars` → Alta de productos en tiempo real.
  - `carts.handlebars` → Listado de carritos.
  - `cart.handlebars` → Detalle de un carrito específico.

---

## 🔐 Variables de entorno

En la raíz del proyecto se utiliza un archivo `.env` para la configuración.

Ejemplo:

```env
PORT=8081
MONGO_URL=tu_string_de_conexion_de_mongo
PORT: puerto en el que se levanta el servidor (por ejemplo 8081).

MONGO_URL: string de conexión de MongoDB Atlas.

En este repositorio se incluye un archivo .env de prueba ya configurado exclusivamente para que el profesor pueda levantar el servidor sin pasos extra.
En un entorno real / proyecto profesional, este archivo no debería versionarse.

🚀 Instalación y ejecución
Clonar el repositorio:

bash
Copiar código
git clone https://github.com/juanmabenta/backend-entrega1.git
cd backend-entrega1-final
Instalar dependencias:

bash
Copiar código
npm install
Verificar el archivo .env de la raíz del proyecto (ya incluido en el repositorio para la corrección).
Si se desea, se puede modificar el valor de PORT o MONGO_URL.

Levantar el servidor en modo desarrollo:

bash
Copiar código
npm run dev
Por defecto el servidor corre en http://localhost:8081 (o el puerto configurado en PORT).

📦 API de Productos
Ruta base: http://localhost:8081/api/products

✅ GET /api/products
Devuelve la lista de productos con soporte para:

limit (opcional, default = 10) → cantidad de productos por página.

page (opcional, default = 1) → número de página.

sort (opcional) → asc o desc para ordenar por precio.

query (opcional):

category:algo → filtra por categoría.

status:true o status:false → filtra por disponibilidad.

Ejemplos:

GET /api/products?limit=5&page=2

GET /api/products?query=category:remeras&sort=asc

GET /api/products?query=status:true&sort=desc

Respuesta (formato pedido en la consigna):

json
Copiar código
{
  "status": "success",
  "payload": [/* productos */],
  "totalPages": 0,
  "prevPage": null,
  "nextPage": null,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevLink": null,
  "nextLink": null
}
prevLink y nextLink son URLs armadas con los mismos query params pero apuntando a la página anterior/siguiente.

También están implementados los endpoints básicos de CRUD de productos siguiendo la estructura vista en clase.

🛒 API de Carritos
Ruta base: http://localhost:8081/api/carts

El modelo de Cart guarda los productos en un array products, donde cada elemento tiene:

js
Copiar código
{
  product: ObjectId // referencia al modelo Product
  quantity: Number
}
La ruta GET /api/carts/:cid usa populate para devolver los productos completos.

✅ Endpoints solicitados en la consigna
DELETE /api/carts/:cid/products/:pid
Elimina del carrito :cid el producto :pid.

PUT /api/carts/:cid
Actualiza todos los productos del carrito con un arreglo de productos enviado en el body:

json
Copiar código
{
  "products": [
    { "product": "ID_PRODUCTO_1", "quantity": 2 },
    { "product": "ID_PRODUCTO_2", "quantity": 5 }
  ]
}
PUT /api/carts/:cid/products/:pid
Actualiza solo la cantidad de un producto específico en el carrito:

json
Copiar código
{
  "quantity": 7
}
DELETE /api/carts/:cid
Elimina todos los productos del carrito indicado.

👀 Vistas con Handlebars
/products
Vista principal de productos con paginación.

Muestra:

título

precio

categoría

Usa los datos de paginación recibidos de la API:

page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage

Soporta carrito activo mediante query param cid:

Ejemplo: /products?cid=ID_DEL_CARRITO

Permite que el botón “Agregar al carrito” sepa a qué carrito agregar.

/products/:pid
Vista de detalle de un producto:

Muestra descripción completa, precio, categoría, etc.

Incluye botón “Agregar al carrito” usando el cartId (si viene en la query: ?cid=...).

/realtimeproducts
Vista de productos en tiempo real:

Formulario para crear productos (title, description, code, price, stock, category, status).

Listado que se actualiza vía WebSockets (Socket.io) cuando se crea un producto nuevo.

/carts
Vista de listado de carritos:

Muestra todos los carritos existentes.

Botón para crear un carrito nuevo (POST /carts/create).

Cada carrito tiene link a /carts/:cid.

/carts/:cid
Vista de detalle de un carrito:

Lista SOLO los productos pertenecientes a ese carrito.

Cada ítem incluye los datos del producto gracias al populate.

🔎 Flujo sugerido para corrección
Ir a http://localhost:8081/carts y crear un carrito nuevo.

Copiar el cartId (se redirige a /carts/:cid).

Ir a http://localhost:8081/products?cid=EL_ID_DEL_CARRITO.

Probar:

paginación (limit, page)

filtros (query=category:..., query=status:true)

ordenamiento por precio (sort=asc / sort=desc)

botón “Agregar al carrito”

Ver el contenido del carrito en /carts/:cid.

Probar los endpoints de actualización/eliminación de productos del carrito:

PUT /api/carts/:cid

PUT /api/carts/:cid/products/:pid

DELETE /api/carts/:cid/products/:pid

DELETE /api/carts/:cid

📝 Notas para la corrección
Para ejecutar el proyecto:

bash
Copiar código
npm install
npm run dev
El proyecto ya incluye un archivo .env de ejemplo con PORT y MONGO_URL configurados, para que se pueda levantar el servidor directamente.
En un entorno real este archivo debería excluirse del repositorio.
