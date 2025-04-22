import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import users from "./routes/users.js";
import usersdata from "./routes/usersdata.js";

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", users);
app.use("/users/data", usersdata);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));