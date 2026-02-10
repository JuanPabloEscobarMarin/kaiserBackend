import { appointments } from "./appointments.js";
import { services } from "./services.js";
import { saveToDisk } from "../db/database.js";

export class Employee {
  constructor({
    id,
    createdAt,
    name,
    firstLastName,
    secondLastName,
    position = "DefaultPosition",
    state = true,
  } = {}) {
    if (
      !name ||
      !firstLastName ||
      name.trim().length === 0 ||
      firstLastName.trim().length === 0 ||
      !secondLastName ||
      secondLastName.trim().length === 0
    ) {
      throw new Error("name and lastnames cant be blank");
    }
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.firstLastName = firstLastName;
    this.secondLastName = secondLastName;
    this.position = position;
    this.state = state;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
  }
}

export const employees = [];

// Express controller functions
export const getAllEmployees = (req, res) => {
  res.json(employees);
};

export const addEmployee = (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    employees.push(newEmployee);
    saveToDisk();
    res
      .status(201)
      .json({ message: "Empleado agregado exitosamente", data: newEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployeeById = (req, res) => {
  const employee = employees.find((e) => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({ error: "Employee not found" });
  }
  res.json(employee);
};

export const updateEmployee = (req, res) => {
  try {
    const employeeId = req.params.id;
    const update = req.body;
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const finalName = update.name !== undefined ? update.name : employee.name;
    const finalFirstLastName =
      update.firstLastName !== undefined
        ? update.firstLastName
        : employee.firstLastName;
    const finalSecondLastName =
      update.secondLastName !== undefined
        ? update.secondLastName
        : employee.secondLastName;
    if (
      finalName.trim().length === 0 ||
      finalFirstLastName.trim().length === 0 ||
      finalSecondLastName.trim().length === 0
    ) {
      throw new Error("name and lastnames cant be blank");
    }
    employee.name = finalName;
    employee.firstLastName = finalFirstLastName;
    employee.secondLastName = finalSecondLastName;
    employee.position =
      update.position !== undefined ? update.position : employee.position;
    employee.state = update.state !== undefined ? update.state : employee.state;
    saveToDisk();
    res.json({ message: "Empleado actualizado exitosamente", data: employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEmployee = (req, res) => {
  try {
    const employeeId = req.params.id;
    const hasAppointments = appointments.some(
      (e) => e.employeeId === employeeId && e.state === "scheduled",
    );
    if (hasAppointments) {
      return res.status(400).json({
        error:
          "Cant delete this Employee, there are appointments with this employee",
      });
    }
    const index = employees.findIndex((e) => e.id === employeeId);
    if (index !== -1) {
      const deleted = employees.splice(index, 1)[0];
      saveToDisk();
      res.json({
        message: "Empleado eliminado exitosamente",
        deletedId: deleted.id,
        name: deleted.name,
      });
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
