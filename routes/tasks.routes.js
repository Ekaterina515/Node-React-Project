//import express from "express";
const express = require("express");
import tasksController from "../controllers/tasks.controller";

const router = express.Router();

router.get("/tasks", tasksController.getTasks);
router.post("/tasks", tasksController.addTask);
router.put("/tasks", tasksController.editTask);
router.delete("/tasks", tasksController.deleteTask);

export default router;
