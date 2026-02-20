import crypto from "crypto";
import { saveToDisk } from "../db/database.js";

export class User {
  constructor({ id, username, password, number, role } = {}) {
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length === 0
    ) {
      throw new Error("username is required");
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      throw new Error("password is required");
    }
    if (!number || typeof number !== "string" || number.trim().length === 0) {
      throw new Error("number is required");
    }
    this.id = id || crypto.randomUUID();
    this.username = username;
    this.password = password;
    this.number = number;
    this.role = role || "client"; // admin or client
  }
}

export const users = [];

// Express controller functions
export const getAllUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

export const addUser = (req, res) => {
  try {
    const { username, password, number, role } = req.body;
    if (
      !username ||
      typeof username !== "string" ||
      username.trim().length === 0
    ) {
      throw new Error("username is required");
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      throw new Error("password is required");
    }
    if (!number || typeof number !== "string" || number.trim().length === 0) {
      throw new Error("number is required");
    }
    const user = new User({ username, password, number, role });
    users.push(user);
    saveToDisk();
    res
      .status(201)
      .json({ message: "Usuario creado exitosamente", data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  Object.assign(user, req.body);
  saveToDisk();
  res.json({ message: "Usuario actualizado", data: user });
};

export const deleteUser = (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  const deleted = users.splice(idx, 1)[0];
  saveToDisk();
  res.json({
    message: "Usuario eliminado",
    deletedId: deleted.id,
    username: deleted.username,
  });
};
