// src/app/pages/api/sales/index.js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case "GET":
      // Obtener todos los productos
      const products = await db.collection("notes").find({}).toArray();
      res.json(products);
      break;
    case "POST":
      // Añadir un nuevo producto
      const count = await db.collection("notes").countDocuments();
      const newProduct = {
        id: count + 1,
        title: req.body.title,
        body: req.body.body,
       
      };
      await db.collection("notes").insertOne(newProduct);
      res.status(201).json(newProduct);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
