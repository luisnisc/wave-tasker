import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection("tasks");
  const id = Number(req.query.id);

  switch (method) {
    case "PUT":
      const update = req.body;
      delete update._id; // Elimina el campo _id del objeto update
      try {
        const task = await collection.findOne({ id: id });
        if (!task) {
          res.status(404).json({ message: `Task: ${id} not found` });
          return;
        }

        const updateTask = await collection.findOneAndUpdate(
          { id: id }, // busca por 'id' y 'userId'
          { $set: update },
          { returnOriginal: false }
        );

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
      try {
        const deleteNotes = await collection.findOneAndDelete({
          id: id,
        });
        if (
          !deleteNotes ||
          !deleteNotes.lastErrorObject ||
          deleteNotes.lastErrorObject.n === 0
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
