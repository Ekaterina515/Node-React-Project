import express from "express";
import tasksController from "./../controllers/tasks.controller.js";

const router = express.Router();

router.get("/", tasksController.getTasks);
router.post("/", tasksController.addTask);
router.put("/", tasksController.editTask);
router.delete("/", tasksController.deleteTask);

export default router;
