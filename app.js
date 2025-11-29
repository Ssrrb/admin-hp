import express from "express";
import { PORT } from "./config.js";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/login", (req, res) => {
    res.json("user");
});

app.post("/register", (req, res) => {
    const { username, password } = req.body; // El body es el objeto que viene en la petición
    const id = UserRepository.create({ username, password });
    res.json({ id });
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