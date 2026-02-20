import fs from "fs";
import { services, Service } from "../controllers/services.js";
import { Appointment, appointments } from "../controllers/appointments.js";
import { Employee, employees } from "../controllers/employees.js";
import { users } from "../controllers/users.controller.js";

//ruta absoluta al json
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

//guarda los datos en el json
export const saveToDisk = () => {
  const data = {
    services,
    employees,
    appointments,
    users,
  };
  const jsonText = JSON.stringify(data, null, 2);
  fs.writeFileSync(DB_PATH, jsonText, "utf-8");
  console.log("The changes has been saved");
};

// carga los datos en el json y los vuelve a instanciar
export const loadFromDisk = () => {
  if (!fs.existsSync(DB_PATH)) return;
  const jsonText = fs.readFileSync(DB_PATH, "utf-8");
  const data = JSON.parse(jsonText);

  services.length = 0;
  employees.length = 0;
  appointments.length = 0;
  users.length = 0;
  if (data.users) {
    const instances = [];
    data.users.forEach((e, i) => {
      try {
        instances.push(new User(e));
      } catch (err) {
        console.error(`Error cargando user[${i}]:`, err.message, e);
      }
    });
    users.push(...instances);
  }

  if (data.services) {
    const instances = [];
    data.services.forEach((e, i) => {
      try {
        instances.push(new Service(e));
      } catch (err) {
        console.error(`Error cargando service[${i}]:`, err.message, e);
      }
    });
    services.push(...instances);
  }
  if (data.employees) {
    const instances = [];
    data.employees.forEach((e, i) => {
      try {
        instances.push(new Employee(e));
      } catch (err) {
        console.error(`Error cargando employee[${i}]:`, err.message, e);
      }
    });
    employees.push(...instances);
  }
  if (data.appointments) {
    const instances = [];
    data.appointments.forEach((e, i) => {
      try {
        instances.push(new Appointment(e));
      } catch (err) {
        console.error(`Error cargando appointment[${i}]:`, err.message, e);
      }
    });
    appointments.push(...instances);
  }
  console.log(
    `The data has been charged: services=${services.length}, employees=${employees.length}, appointments=${appointments.length}, users=${users.length}`,
  );
};
