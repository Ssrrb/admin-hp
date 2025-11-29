import express from "express";
import { PORT } from "./config.js";
import { UserRepository } from "./user-repository.js";

const app = express();

// Parse JSON bodies so req.body is populated
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/login", (req, res) => {
    res.json("user");
});

app.post("/register", (req, res) => {
    try {
        const { username, password } = req.body ?? {};
        const id = UserRepository.create({ username, password });
        res.send({ id });
        res.status(201).json({ id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    res.send("Logout");
});

app.get("/protected", (req, res) => {
    res.send("Protected");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
