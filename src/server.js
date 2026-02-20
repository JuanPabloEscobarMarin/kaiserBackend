import { app } from "./app.js";
import sequelize from "./sequelize.js";

const PORT = process.env.PORT || 3000;

try {
  await sequelize.authenticate()
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
