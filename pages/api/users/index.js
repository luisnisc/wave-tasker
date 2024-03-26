import { connectToDatabase } from "../../../utils/mongodb";

export default async function handler(req, res) {
    const { method } = req;
    const { db } = await connectToDatabase();

    switch (method) {
        case "GET":
       
            const users = await db.collection("users").find({}).toArray();
            res.json(users);
            break;
        case "POST":
       
            const count = await db.collection("users").countDocuments();
            const newUser = {
                id: count + 1,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
             
            };
            await db.collection("users").insertOne(newUser);
            res.status(201).json(newUser);
            break;
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}