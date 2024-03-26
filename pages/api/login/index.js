import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();

    switch (method) {
        case "POST":
            const { username, password } = req.body;

            // Comprueba si el usuario ya existe
            const user = await db.collection("users").findOne({ username });
            if (!user) {
                return res.status(400).json({ message: 'User does not exist' });
            }

            // Compara la contraseña proporcionada con la almacenada en la base de datos
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Si las contraseñas coinciden, devuelve el usuario
            res.json(user);
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}