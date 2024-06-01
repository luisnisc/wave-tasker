// Importamos la función para conectar a la base de datos
import { connectToDatabase } from "../../../utils/mongodb";

// Exportamos una función asíncrona que será nuestro manejador de peticiones
export default async function handler(req, res) {
  // Extraemos el método de la petición
  const { method } = req;

  // Nos conectamos a la base de datos
  const { db } = await connectToDatabase();

  // Obtenemos la colección 'notes'
  const collection = db.collection("notes");

  // Extraemos el id de la petición y lo convertimos a número
  const { id: idString } = req.query;
  const id = Number(idString);

  // Dependiendo del método de la petición, realizamos diferentes acciones
  switch (method) {
    case "PUT":
      // Extraemos el cuerpo de la petición
      const update = req.body;

      // Eliminamos el campo _id del objeto update
      delete update._id;

      try {
        // Intentamos actualizar la nota en la base de datos
        const updateNote = await collection.findOneAndUpdate(
          { id: id }, // busca por 'id'
          { $set: update }, // establece los nuevos valores
          { returnOriginal: false } // devuelve el documento actualizado
        );

        // Si la actualización fue exitosa, respondemos con un mensaje y la nota actualizada
        if (
          !updateNote ||
          !updateNote.lastErrorObject ||
          !updateNote.lastErrorObject.updatedExisting
        )
          res.json({
            message: `Note: ${id} updated`,
            product: updateNote.value,
          });
      } catch (error) {
        // Si hubo un error, lo registramos y respondemos con un mensaje de error
        console.error(error);
        res.status(500).json({ message: "Error to update the note" });
      }
      break;
    case "DELETE":
      try {
        // Intentamos eliminar la nota de la base de datos
        const deleteNotes = await collection.findOneAndDelete({
          id: id,
        });

        // Si la eliminación fue exitosa, respondemos con un mensaje
        if (
          !deleteNotes ||
          !deleteNotes.lastErrorObject ||
          deleteNotes.lastErrorObject.n === 0
        )
          res.json({ message: `Note: ${id} deleted` });
      } catch (error) {
        // Si hubo un error, lo registramos y respondemos con un mensaje de error
        console.error(error);
        res.status(500).json({ message: "Error to delete the note" });
      }
      break;
    default:
      // Si el método de la petición no es ni PUT ni DELETE, respondemos con un error
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}