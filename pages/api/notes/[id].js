// src/app/pages/api/sales/[id].js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection("notes");
  const { id: idString } = req.query;
  const id = Number(idString);

  switch (method) {
    case "PUT":
      // Actualizar un producto por ID
      const update = req.body;
      try {
        const updateProduct = await collection.findOneAndUpdate(
          { id: id },
          { $set: update },
          { returnOriginal: false }
        );
        if (
          !updateProduct ||
          !updateProduct.lastErrorObject ||
          !updateProduct.lastErrorObject.updatedExisting
        )
        res.json({
          message: `Note: ${id} updated`,
          product: updateProduct.value,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error to update the note" });
      }
      break;
    case "DELETE":
      // Eliminar un producto por ID
      try {
        const deleteProduct = await collection.findOneAndDelete({ id: id });
        if (
          !deleteProduct ||
          !deleteProduct.lastErrorObject ||
          deleteProduct.lastErrorObject.n === 0
        ) 
        res.json({ message: `Note: ${id} deleted` });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error to delete the note" });
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
