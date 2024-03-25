// src/app/pages/api/tasks/[id].js
import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();
    const collection = db.collection("tasks");
    const { id: idString } = req.query;
    const id = Number(idString);

    switch (method) {
        case "PUT":
            // Actualizar una tarea por ID
            const update = req.body;
            try {
                const updateTask = await collection.findOneAndUpdate(
                    { id: id },
                    { $set: update },
                    { returnOriginal: false }
                );
                if (
                    !updateTask ||
                    !updateTask.lastErrorObject ||
                    !updateTask.lastErrorObject.updatedExisting
                )
                res.json({
                    message: `Task: ${id} updated`,
                    task: updateTask.value,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error to update the task" });
            }
            break;
        case "DELETE":
            // Eliminar una tarea por ID
            try {
                const deleteTask = await collection.findOneAndDelete({ id: id });
                if (
                    !deleteTask ||
                    !deleteTask.lastErrorObject ||
                    deleteTask.lastErrorObject.n === 0
                ) 
                res.json({ message: `Task: ${id} deleted` });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error to delete the task" });
            }
            break;
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}