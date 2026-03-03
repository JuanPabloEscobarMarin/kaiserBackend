import type { Request, Response } from "express";
import EmployeeService from "../services/employee.services.ts";

class EmployeeController {
    getAll = async (_: Request, res: Response) =>
        res.json(await EmployeeService.getAll());

    getById = async (req: Request, res: Response) => {
        try {
            const employee = await EmployeeService.getById(req.params.id);
            return employee
                ? res.json(employee)
                : res.status(404).json({ error: "Employee not found" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
        }
    };

    save = async (req: Request, res: Response) => {
        try {
            const employee = await EmployeeService.create(req.body);
            return res.status(201).json({
                message: "Empleado creado exitosamente",
                data: employee,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const employee = await EmployeeService.update(
                req.params.id,
                req.body,
            );
            return res.json({
                message: "Empleado actualizado",
                data: employee,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const employee = await EmployeeService.delete(req.params.id);
            return res.json({
                message: "Empleado eliminado",
                data: { id: employee.id, name: employee.name },
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
    };
}

export default new EmployeeController();
