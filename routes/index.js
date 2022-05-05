import express from "express";
import tasksRoutes from "./tasks.routes.js";
import usersRoutes from "./users.routes.js";

const router = express.Router();

router.use("/tasks", tasksRoutes);
router.use("/users", usersRoutes);

export default router;
