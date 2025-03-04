import express from "express"
import dotenv from "dotenv"
import AuthRoutes from "./Routes/AuthRoutes.js"
import UserRoutes from "./Routes/UserRoutes.js"
import CapsuleRoutes from "./Routes/CapsuleRoutes.js"
import MessageRoutes from "./Routes/MessageRoutes.js"
import GameRoutes from "./Routes/GameRoutes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

import { ConnectDB } from "./Lib/Database.js";
import { app, server } from "./Lib/Socket.js"

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.143.158:5173"],
    credentials: true
}))


app.use("/Api/Auth", AuthRoutes);
app.use("/Api/User", UserRoutes);
app.use("/Api/Capsule", CapsuleRoutes);
app.use("/Api/Message", MessageRoutes);
app.use("/Api/Game", GameRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server Running on Port:", PORT)
    ConnectDB();
})