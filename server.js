import express from "express";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";

const app = express();
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// salud
app.get("/", (_req, res) => {
  res.json({ ok: true, msg: "API up" });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
