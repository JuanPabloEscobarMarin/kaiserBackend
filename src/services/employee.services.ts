import { NotFoundException } from "../exceptions/NotFoundException.ts";
import EmployeeRepository from "../repositories/employee.repository.ts";

class EmployeeService {
  getAll = async () => await EmployeeRepository.all();

  getById = async (id: any) => {
    if (!this.isEmployeeIdValid(id)) throw Error("No es un id valido");

    const employee = await EmployeeRepository.byId(id);
    if (!employee) throw new NotFoundException("Employee not found");

    return employee;
  };

  getByServiceId = async (id: any) => {
    if (!this.isEmployeeIdValid) throw Error("No es un id valida");

    return await EmployeeRepository.byServiceId(id);
  };

  create = async ({ fullName, state, phone, salary }: any) => {
    if (
      !fullName ||
      typeof fullName !== "string" ||
      fullName.trim().length === 0
    ) {
      throw new Error("fullName is required");
    }

    if (!phone || phone === null) {
      throw new Error("phone is required");
    }

    if (!salary || salary === null) {
      throw new Error("salary is required");
    }

    return await EmployeeRepository.save({
      fullName,
      state,
      phone,
      salary,
    });
  };

  update = async (id: any, { fullName, state, phone, salary }: any) => {
    if (!this.isEmployeeIdValid(id)) throw Error("No es un id valido");

    //TODO: Agregar validaciones
    // Agregar validacion de que no haya un appointment AGENDADO con este empleado antes de desactivarlo o borrarlo
    // o de cambiarle el tiempo o el precio

    return await EmployeeRepository.update(id, {
      fullName,
      state,
      phone,
      salary,
    });
  };

  delete = async (id: any) => {
    // Agregar validacion de que no haya un appointment AGENDADO con este empleado antes de borrarlo
    if (!this.isEmployeeIdValid(id)) throw Error("No es un id valido");
    return await EmployeeRepository.delete(id);
  };

  private isEmployeeIdValid = (id: any) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
}

export default new EmployeeService();
