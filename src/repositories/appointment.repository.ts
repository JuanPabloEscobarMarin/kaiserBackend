import type { AppointmentState } from "../../generated/prisma/enums.ts";
import { prisma } from "../app.ts";

interface AppointmentCreateParams {
  serviceId: string;
  employeeId: string;
  state: AppointmentState;
}

interface AppointmentUpdateParams {
  serviceId?: string;
  employeeId?: string;
  state?: AppointmentState;
}

class AppointmentRepository {
  all = async () =>
    await prisma.appointment.findMany({
      include: { employee: true, service: true, Customer: true },
      omit: { employeeId: true, serviceId: true },
    });

  byId = async (id: string) =>
    await prisma.appointment.findFirst({
      where: { id },
      include: { Customer: true },
    });

  save = async (appointment: AppointmentCreateParams) =>
    await prisma.appointment.create({ data: appointment });

  update = async (id: string, appointment: AppointmentUpdateParams) =>
    await prisma.appointment.update({ where: { id }, data: appointment });

  delete = async (id: string) =>
    await prisma.appointment.delete({ where: { id } });

  availableDateByDate = async (date: string) =>
    await prisma.appointment.findMany({
      where: {
        Customer: { some: { ingress: { not: new Date(date) } } },
      },
      include: { Customer: true, service: true, employee: true },
    });

  availableDate = async () =>
    await prisma.appointment.findMany({
      where: { Customer: { some: { ingress: { lt: new Date() } } } },
      include: { Customer: true, service: true, employee: true },
    });
}

export default new AppointmentRepository();
