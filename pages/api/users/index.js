// Importamos la función para conectar a la base de datos y la librería bcrypt para el manejo de contraseñas
import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from 'bcryptjs';

// Exportamos una función asíncrona que será nuestro manejador de peticiones
export default async function handler(req, res) {
    // Extraemos el método de la petición
    const { method } = req;

    // Nos conectamos a la base de datos
    const { db } = await connectToDatabase();

    // Dependiendo del método de la petición, realizamos diferentes acciones
    switch (method) {
        case "GET":
            // Obtenemos todos los usuarios de la base de datos
            const users = await db.collection("users").find({}).toArray();

            // Respondemos con los usuarios
            res.json(users);
            break;
        case "POST":
            // Extraemos el email, nombre de usuario, contraseña y color de la petición
            const { email, username, password, color } = req.body;

            // Comprobamos si el usuario ya existe
            const existingEmail = await db.collection("users").findOne({ email });
            const existingUser = await db.collection("users").findOne({ username });
            if (existingEmail || existingUser) {
                // Si el usuario ya existe, respondemos con un mensaje de error
                return res.status(400).json({ message: 'User already exists' });
            } else {
                // Si el usuario no existe, encriptamos la contraseña
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Obtenemos el número de usuarios en la base de datos
                const count = await db.collection("users").countDocuments();

                // Creamos el nuevo usuario
                const newUser = {
                    id: count + 1,
                    email,
                    username,
                    password: hashedPassword,
                    color,
                };

                // Insertamos el nuevo usuario en la base de datos
                await db.collection("users").insertOne(newUser);

                // Respondemos con el nuevo usuario
                res.status(201).json(newUser);
                break;
            }
        default:
            // Si el método de la petición no es ni GET ni POST, respondemos con un error
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}