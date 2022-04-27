import express from "express";
import routes from "./../routes/index.js";

const app = express();

const port = 4000;

app.use(express.json());
app.use('/api', routes);

app.listen(port, () => console.log("[server] is started"));
