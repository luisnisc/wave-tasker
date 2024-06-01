// Importamos la función para conectar a la base de datos y la librería bcrypt para el manejo de contraseñas
import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from "bcryptjs";

// Exportamos una función asíncrona que será nuestro manejador de peticiones
export default async function handler(req, res) {
  // Extraemos el método de la petición
  const { method } = req;

  // Nos conectamos a la base de datos
  const { db } = await connectToDatabase();

  // Obtenemos la colección 'users'
  const collection = db.collection("users");

  // Dependiendo del método de la petición, realizamos diferentes acciones
  switch (method) {
    case "PUT":
      // Extraemos el nombre de usuario y la nueva contraseña de la petición
      const { username, newPassword } = req.body;

      try {
        // Buscamos el usuario en la base de datos
        const user = await collection.findOne({ username: username });

        // Si el usuario no existe, respondemos con un mensaje de error
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        // Generamos una "sal" para la contraseña
        const salt = await bcrypt.genSalt(10);

        // Hasheamos la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizamos la contraseña del usuario en la base de datos
        const updateUser = await collection.findOneAndUpdate(
          { username: username },
          { $set: { password: hashedPassword } },
          { returnOriginal: false }
        );

        // Respondemos con un mensaje y el usuario actualizado
        res.json({
          message: `User: ${username} updated`,
          user: updateUser.value,
        });
      } catch (error) {
        // Si hubo un error, lo registramos y respondemos con un mensaje de error
        console.error(error);
        res.status(500).json({ message: error.message });
      }
      break;
    default:
      // Si el método de la petición no es PUT, respondemos con un error
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}