import type { AppointmentState } from "../../generated/prisma/enums.ts";
import { prisma } from "../app.ts";

interface AppointmentCreateParams {
    serviceId: string;
    employeeId: string;
    startTime: Date;
    customerName: string;
    customerNumber: string;
    state: AppointmentState;
    observation: string;
}

interface AppointmentUpdateParams {
    serviceId?: string;
    employeeId?: string;
    startTime?: Date;
    customerName?: string;
    customerNumber?: string;
    state?: AppointmentState;
    observation?: string;
}

class AppointmentRepository {
    all = async () => await prisma.appointment.findMany();

    byId = async (id: string) =>
        await prisma.appointment.findFirst({ where: { id } });

    save = async (appointment: AppointmentCreateParams) =>
        await prisma.appointment.create({ data: appointment });

    update = async (id: string, appointment: AppointmentUpdateParams) =>
        await prisma.appointment.update({ where: { id }, data: appointment });

    delete = async (id: string) =>
        await prisma.appointment.delete({ where: { id } });
}

export default new AppointmentRepository();
