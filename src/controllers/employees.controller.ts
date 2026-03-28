import type { Request, Response } from "express";
import EmployeeService from "../services/employee.services.ts";

class EmployeeController {
  getAll = async (_: Request, res: Response) =>
    res.json(await EmployeeService.getAll());

  getById = async (req: Request, res: Response) =>
    res.json(await EmployeeService.getById(req.params.id));

  getByServiceId = async (req: Request, res: Response) => {
    const employees = await EmployeeService.getByServiceId(req.params.id);
    return res.json(employees);
  };

  save = async (req: Request, res: Response) => {
    return res.status(201).json({
      message: "Empleado creado exitosamente",
      data: await EmployeeService.create(req.body),
    });
  };

  update = async (req: Request, res: Response) => {
    return res.json({
      message: "Empleado actualizado",
      data: await EmployeeService.update(req.params.id, req.body),
    });
  };

  delete = async (req: Request, res: Response) => {
    return res.json({
      message: "Empleado eliminado",
      employee_id: (await EmployeeService.delete(req.params.id)).id,
    });
  };
}

export default new EmployeeController();
