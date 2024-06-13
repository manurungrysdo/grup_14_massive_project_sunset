import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser, registerUser } from "../controllers/UserController.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.post("/users/register", registerUser); // Endpoint untuk registrasi pengguna
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/login", loginUser);

export default router;
