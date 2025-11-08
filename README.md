# Entrega 2 — Handlebars + WebSockets

## Instalación
```bash
npm i
npm i express-handlebars socket.io
```

## Ejecución
```bash
npm run start
# o
npm run dev
```

## Endpoints
- `GET /` -> Home con lista de productos (SSR)
- `GET /realtimeproducts` -> Vista con updates en vivo
- `POST /api/products` -> Crea producto `{ "title": "...", "price": 123 }`
- `DELETE /api/products/:pid` -> Elimina producto
```
