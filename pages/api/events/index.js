import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();

    switch (method) {
        case "GET":
            // Obtener todas las tareas para el usuario específico
              const notes = await db.collection("events").find({ userId: req.query.userId}).toArray();
            res.json(notes);
            break;
        case "POST":
            // Añadir una nueva tarea para el usuario específico
            const count = await db.collection("events").countDocuments();
            const newNote = {
                id: count + 1,
                event: req.body.event,
                userId: req.body.userId, // Asegúrate de que el ID del usuario se envía desde el cliente
                // Asegúrate de que los campos adicionales que necesitas estén aquí
            };
            await db.collection("events").insertOne(newNote);
            res.status(201).json(newNote);
            break;
            
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}