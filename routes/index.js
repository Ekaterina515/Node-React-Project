//import express from "express";
const express = require("express");
import tasksRoutes from "./tasks.routes";

const router = express.Router();

router.use("/tasks", tasksRoutes);

export default router;
