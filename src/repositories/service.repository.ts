import type { Category, Position } from "../../generated/prisma/enums.ts";
import { prisma } from "../app.ts";

interface ServiceCreateParams {
    name: string;
    price: string;
    time: string;
    category: Category;
    state: boolean;
    discount: string;
    position: Position;
}

interface ServiceUpdateParams {
    name?: string;
    price?: string;
    time?: string;
    description?: string;
    category?: Category;
    state?: boolean;
    discount?: string;
    position?: Position;
}

class ServiceRepository {
    all = async () => await prisma.service.findMany();

    byId = async (id: string) =>
        await prisma.service.findFirst({ where: { id } });

    save = async (service: ServiceCreateParams) =>
        await prisma.service.create({ data: service });

    update = async (id: string, service: ServiceUpdateParams) =>
        await prisma.service.update({ where: { id }, data: service });

    delete = async (id: string) =>
        await prisma.service.delete({ where: { id } });
}

export default new ServiceRepository();
