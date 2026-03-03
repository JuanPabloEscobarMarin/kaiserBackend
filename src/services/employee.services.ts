import EmployeeRepository from "../repositories/employee.repository.ts";

class EmployeeService {
    getAll = async () => await EmployeeRepository.all();

    getById = async (id: any) => {
        if (!this.isEmployeeIdValid(id)) throw Error("No es un id valido");

        return await EmployeeRepository.byId(id);
    };

    create = async (
        { name, firstLastName, secondLastName, position, state, phone, salary }:
            any,
    ) => {
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new Error("name is required");
        }

        if (!phone || phone === null) {
            throw new Error("phone is required");
        }

        if (!salary || salary === null) {
            throw new Error("salary is required");
        }

        if (!position || position === null) {
            throw new Error("position is required");
        }

        if (
            !firstLastName || typeof firstLastName !== "string" ||
            firstLastName.trim().length === 0
        ) {
            throw new Error("firstLastName is required");
        }

        if (
            !secondLastName || typeof secondLastName !== "string" ||
            secondLastName.trim().length === 0
        ) {
            throw new Error("secondLastName is required");
        }

        return await EmployeeRepository.save({
            name,
            firstLastName,
            secondLastName,
            position,
            state,
            phone,
            salary,
        });
    };

    update = async (
        id: any,
        { name, firstLastName, secondLastName, position, state, phone, salary }:
            any,
    ) => {
        if (!this.isEmployeeIdValid(id)) throw Error("No es un id valido");

        //TODO: Agregar validaciones
        // Agregar validacion de que no haya un appointment AGENDADO con este empleado antes de desactivarlo o borrarlo
        // o de cambiarle el tiempo o el precio

        return await EmployeeRepository.update(id, {
            name,
            firstLastName,
            secondLastName,
            position,
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
