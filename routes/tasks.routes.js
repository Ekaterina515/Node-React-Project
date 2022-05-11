import express from "express";
import tasksController from "./../controllers/tasks.controller.js";
import authenticationMiddleware from "./../middlewares/authentication.middleware.js";

const router = express.Router();

router.get("/", authenticationMiddleware, tasksController.getTasks);
router.post("/", authenticationMiddleware, tasksController.addTask);
router.put("/", authenticationMiddleware, tasksController.editTask);
router.delete("/", authenticationMiddleware, tasksController.deleteTask);

export default router;
