import type { Role } from "../../generated/prisma/enums.ts";
import { prisma } from "../app.ts"

interface UserCreateParams {
    username: string,
    password: string,
    phone: string,
    role: Role
}

interface UserUpdateParams {
    username?: string,
    password?: string,
    phone?: string,
    role?: Role
}

class UserRepository {
    all = async () => await prisma.user.findMany();

    byId = async (id: string) => await prisma.user.findFirst({ where: { id } })

    save = async (user: UserCreateParams) => await prisma.user.create({ data: user })

    update = async (id: string, user: UserUpdateParams) => await prisma.user.update({ where: { id }, data: user })

    delete = async (id: string) => await prisma.user.delete({ where: { id } })
}

export default new UserRepository()
