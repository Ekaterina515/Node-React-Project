import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import routes from "./../routes/index.js";

const app = express();

const port = 4000;

app.use(express.json());
app.use(cookieParser(process.env.SECRET_COOKIE));
app.use("/api", routes);

app.listen(port, () => console.log("[server] is started"));
