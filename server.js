import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import viewsRouter from './src/routes/views.router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'src', 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Socket.io (si más adelante usás eventos, van acá)
io.on('connection', () => {
  // console.log('Nuevo cliente conectado');
});

// 🔹 Conexión a MongoDB Atlas y luego levantar el servidor
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');

    httpServer.listen(PORT, () => {
      console.log(`Servidor listo: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error);
  });
