import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();

    switch (method) {
        case "POST":
            const { username, password } = req.body;
            const user = await db.collection("users").findOne({ username, password });

            if (user) {
                res.status(200).json(user);
            } else {
                res.status(401).json({ message: "Invalid username or password" });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}