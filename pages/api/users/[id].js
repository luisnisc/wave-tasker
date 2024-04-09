import { connectToDatabase } from "../../../utils/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();
  const collection = db.collection("users");

  switch (method) {
    case "PUT":
      const { username, newPassword } = req.body; // Get the username from the request body
      try {
        const user = await collection.findOne({ username: username });
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        };
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const updateUser = await collection.findOneAndUpdate(
          { username: username },
          { $set: { password: hashedPassword } },
          { returnOriginal: false }
        );
          res.json({
            message: `User: ${username} updated`,
            user: updateUser.value,
          });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message }); // Send the error message to the client
      }
      break;
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}