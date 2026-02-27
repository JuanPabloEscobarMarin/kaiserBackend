import AppointmentsController, { AppointmentState } from "./appointments.ts";
import { saveToDisk } from "../db/database.ts";
import type { Request, Response } from "express";

interface Employee {
  id: string;
  name: string;
  firstLastName: string;
  secondLastName: string;
  position: string;
  state: boolean;
  createdAt: Date
}

class EmployeesController {
  employees: Array<Employee> = [];

  getAll = (_: Request, res: Response) => res.json(this.employees);

  getById = (req: Request, res: Response) => {
    const employee = this.employees.find((e) => e.id === req.params.id);

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    return res.json(employee);
  };

  save = (req: Request, res: Response) => {
    const { name, firstLastName, secondLastName, position, state = true } = req.body;

    try {
      const employee: Employee = {
        id: crypto.randomUUID(),
        name,
        firstLastName,
        secondLastName,
        position,
        state,
        createdAt: new Date()
      };

      this.employees.push(employee);
      saveToDisk();

      return res.status(201).json({ message: "Empleado agregado exitosamente", data: employee });
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  };

  update = (req: Request, res: Response) => {
    try {
      const employeeId = req.params.id;
      const update = req.body;
      const employee = this.employees.find((e) => e.id === employeeId);

      if (!employee) throw new Error("Employee not found");

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
      ) throw new Error("name and lastnames cant be blank");

      employee.name = finalName;
      employee.firstLastName = finalFirstLastName;
      employee.secondLastName = finalSecondLastName;
      employee.position =
        update.position !== undefined ? update.position : employee.position;
      employee.state = update.state !== undefined ? update.state : employee.state;
      saveToDisk();

      return res.json({ message: "Empleado actualizado exitosamente", data: employee });
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  };

  delete = (req: Request, res: Response) => {
    try {
      const employeeId = req.params.id;
      const hasAppointments = AppointmentsController.appointments.some(
        (e) => e.employeeId === employeeId && e.state === AppointmentState.SCHEDULED,
      );

      if (hasAppointments) throw new Error("Cant delete this Employee, there are appointments with this employee");

      const index = this.employees.findIndex((e) => e.id === employeeId);

      if (index !== -1) {
        const deleted = this.employees.splice(index, 1)[0];
        saveToDisk();

        return res.json({
          message: "Empleado eliminado exitosamente",
          employee: {
            id: deleted?.id,
            name: deleted?.name
          }
        });
      } else {
        throw new Error("Employee not found");
      }
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  };
}

export default new EmployeesController();