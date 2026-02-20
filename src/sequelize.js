import { Sequelize } from "sequelize";

const DB_PASSWORD = process.env.DB_PASSWORD;
const sequelize = new Sequelize(`postgresql://postgres:${DB_PASSWORD}@db.ahycfgvwvmlffycvwlxm.supabase.co:5432/postgres`)

export default sequelize;