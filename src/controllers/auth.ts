import { users } from "./users.ts";
import { SignJWT } from "jose";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

  const valid = password === user.password;
  if (!valid) return res.status(401).json({ error: "Credenciales inválidas" });

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const jwt = await new SignJWT({ id: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  res.cookie("jwt_token", jwt).json({ message: "Login exitoso" });
};

export const logout = (req, res) => {
  res.clearCookie("jwt_token").json({ message: "Sesion terminada" });
};
