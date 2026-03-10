import { prisma } from "../app.ts";

class SearchRepository {
    searchServices = async (tokens: string[]) => {
        const orConditions = tokens.map((token) => ({
            name: { contains: token, mode: "insensitive" as const },
        }));

        return await prisma.service.findMany({
            where: {
                OR: orConditions,
                state: true,
            },
            select: {
                id: true,
                name: true,
                price: true,
                duration: true,
                discount: true,
            },
        });
    };

    getAllServices = async () =>
        await prisma.service.findMany({
            where: { state: true },
            select: {
                id: true,
                name: true,
                price: true,
                duration: true,
                discount: true,
            },
        });
}

export default new SearchRepository();
