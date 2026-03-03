import type { Position } from "../../generated/prisma/enums.ts";
import { prisma } from "../app.ts";

interface EmployeeCreateParams {
    name: string;
    firstLastName: string;
    secondLastName: string;
    position: Position;
    state: boolean;
    phone: string;
    salary: string;
}

interface EmployeeUpdateParams {
    name?: string;
    firstLastName?: string;
    secondLastName?: string;
    position?: Position;
    state?: boolean;
    phone?: string;
    salary?: string;
}

class EmployeeRepository {
    all = async () => await prisma.employee.findMany();

    byId = async (id: string) =>
        await prisma.employee.findFirst({ where: { id } });

    save = async (employee: EmployeeCreateParams) =>
        await prisma.employee.create({ data: employee });

    update = async (id: string, employee: EmployeeUpdateParams) =>
        await prisma.employee.update({ where: { id }, data: employee });

    delete = async (id: string) =>
        await prisma.employee.delete({ where: { id } });
}

export default new EmployeeRepository();
