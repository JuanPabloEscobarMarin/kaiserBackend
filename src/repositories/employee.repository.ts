import { prisma } from "../app.ts";

interface EmployeeCreateParams {
    fullName: string;
    state: boolean;
    phone: string;
    salary: string;
}

interface EmployeeUpdateParams {
    fullName?: string;
    state?: boolean;
    phone?: string;
    salary?: string;
}

class EmployeeRepository {
    all = async () => await prisma.employee.findMany();

    byId = async (id: string) =>
        await prisma.employee.findFirst({ where: { id } });

    byServiceId = async (id: string) =>
        await prisma.employee.findMany({ where: { appointments: { some: { serviceId: id } } } })

    save = async (employee: EmployeeCreateParams) =>
        await prisma.employee.create({ data: employee });

    update = async (id: string, employee: EmployeeUpdateParams) =>
        await prisma.employee.update({ where: { id }, data: employee });

    delete = async (id: string) =>
        await prisma.employee.delete({ where: { id } });
}

export default new EmployeeRepository();
