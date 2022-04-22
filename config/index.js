//import express from "express";
const express = require("express");
import routes from "./../routes";

const app = express();

const port = 4000;

app.use(express.json());
app.use('/api', routes);

app.listen(port, () => console.log("[server] is started"));
