import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();
    const collection = db.collection("users");
    const { id: idString } = req.query;
    const id = Number(idString);

    switch (method) {
        case "PUT":
            const update = req.body;
            try {
                const updateUser = await collection.findOneAndUpdate(
                    { id: id },
                    { $set: update },
                    { returnOriginal: false }
                );
                if (
                    !updateUser ||
                    !updateUser.lastErrorObject ||
                    !updateUser.lastErrorObject.updatedExisting
                )
                res.json({
                    message: `User: ${id} updated`,
                    user: updateUser.value,
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error to update the user" });
            }
            break;
        case "DELETE":
            try {
                const deleteUser = await collection.findOneAndDelete({ id: id });
                if (
                    !deleteUser ||
                    !deleteUser.lastErrorObject ||
                    deleteUser.lastErrorObject.n === 0
                ) 
                res.json({ message: `User: ${id} deleted` });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Error to delete the user" });
            }
            break;
        default:
            res.setHeader("Allow", ["PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}