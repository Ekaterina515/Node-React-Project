import express from "express";
import usersController from "./../controllers/users.controller.js";

const router = express.Router();

router.get("/", usersController.getUser);
router.post("/registration", usersController.registration);
router.post("/authorization", usersController.authorization);
router.put("/", usersController.editUser);
router.delete("/", usersController.deleteUser);

export default router;
