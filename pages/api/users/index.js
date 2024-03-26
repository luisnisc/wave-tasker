import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();

    switch (method) {
        case "GET":
            const users = await db.collection("users").find({}).toArray();
            res.json(users);
            break;
        case "POST":
            const { email, username, password } = req.body;

            // Comprueba si el usuario ya existe
            const existingUser = await db.collection("users").findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Encripta la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const count = await db.collection("users").countDocuments();
            const newUser = {
                id: count + 1,
                email,
                username,
                password: hashedPassword,
            };
            await db.collection("users").insertOne(newUser);
            res.status(201).json(newUser);
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}