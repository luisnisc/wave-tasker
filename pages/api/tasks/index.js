import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();

    switch (method) {
        case "GET":
            // Obtener todas las tareas para el usuario específico
            const tasks = await db.collection("tasks").find({ userId: req.query.userId }).toArray();
            res.json(tasks);
            break;
        case "POST":
            // Añadir una nueva tarea para el usuario específico
            const count = await db.collection("tasks").countDocuments();
            const newTask = {
                id: count + 1,
                task: req.body.task,
                userId: req.body.userId, 
                checked: req.body.checked
            };
            await db.collection("tasks").insertOne(newTask);
            res.status(201).json(newTask);
            break;
            
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}