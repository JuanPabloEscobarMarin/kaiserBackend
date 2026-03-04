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
    all = async () => await prisma.appointment.findMany({ include: { employee: true, customers: true, service: true }, omit: { employeeId: true, serviceId: true } });

    byId = async (id: string) =>
        await prisma.appointment.findFirst({ where: { id } });

    save = async (appointment: AppointmentCreateParams) =>
        await prisma.appointment.create({ data: appointment });

    update = async (id: string, appointment: AppointmentUpdateParams) =>
        await prisma.appointment.update({ where: { id }, data: appointment });

    delete = async (id: string) =>
        await prisma.appointment.delete({ where: { id } });

    availableDateByDate = async (date: string) => {
        await prisma.appointment.findMany({ where: { customers: { some: { ingress: { gt: new Date(date) } } } }, include: { customers: true, service: true, employee: true } })
    }

    availableDate = async () => await prisma.appointment.findMany({ where: { customers: { some: { ingress: { lt: new Date() } } } }, include: { customers: true } })
}

export default new AppointmentRepository();
