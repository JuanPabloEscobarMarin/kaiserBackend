import { prisma } from "../app.ts";

class CustomerRepository {
  all = async () => prisma.customer.findMany();

  byAppointmentId = async (id: string) =>
    prisma.customer.findMany({ where: { appointmentId: id } });
}

export default new CustomerRepository();
