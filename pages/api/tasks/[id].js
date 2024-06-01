// Importamos la función para conectar a la base de datos
import { connectToDatabase } from "../../../utils/mongodb";

// Exportamos una función asíncrona que será nuestro manejador de peticiones
export default async function handler(req, res) {
  // Extraemos el método de la petición
  const { method } = req;

  // Nos conectamos a la base de datos
  const { db } = await connectToDatabase();

  // Obtenemos la colección 'tasks'
  const collection = db.collection("tasks");

  // Extraemos el id de la petición y lo convertimos a número
  const id = Number(req.query.id);

  // Dependiendo del método de la petición, realizamos diferentes acciones
  switch (method) {
    case "PUT":
      // Extraemos el cuerpo de la petición
      const update = req.body;

      // Eliminamos el campo _id del objeto update
      delete update._id;

      try {
        // Buscamos la tarea en la base de datos
        const task = await collection.findOne({ id: id });

        // Si la tarea no existe, respondemos con un mensaje de error
        if (!task) {
          res.status(404).json({ message: `Task: ${id} not found` });
          return;
        }

        // Intentamos actualizar la tarea en la base de datos
        const updateTask = await collection.findOneAndUpdate(
          { id: id }, // busca por 'id'
          { $set: update }, // establece los nuevos valores
          { returnOriginal: false } // devuelve el documento actualizado
        );

        // Si la actualización fue exitosa, respondemos con un mensaje y la tarea actualizada
        res.json({
          message: `Task: ${id} updated`,
          task: updateTask.value,
        });
      } catch (error) {
        // Si hubo un error, lo registramos y respondemos con un mensaje de error
        console.error(error);
        res.status(500).json({ message: "Error to update the task" });
      }
      break;
    case "DELETE":
      try {
        // Intentamos eliminar la tarea de la base de datos
        const deleteNotes = await collection.findOneAndDelete({
          id: id,
        });

        // Si la eliminación fue exitosa, respondemos con un mensaje
        if (
          !deleteNotes ||
          !deleteNotes.lastErrorObject ||
          deleteNotes.lastErrorObject.n === 0
        )
          res.json({ message: `Task: ${id} deleted` });
      } catch (error) {
        // Si hubo un error, lo registramos y respondemos con un mensaje de error
        console.error(error);
        res.status(500).json({ message: "Error to delete the task" });
      }
      break;
    default:
      // Si el método de la petición no es ni PUT ni DELETE, respondemos con un error
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}