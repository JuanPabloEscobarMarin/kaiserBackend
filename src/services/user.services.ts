import UserRepository from "../repositories/user.repository.ts";

class UserService {

    getAll = async () => await UserRepository.all();

    getById = async ({ id }: any) => {
        if (!this.isUserIdValid(id)) throw Error("No es un id valido");

        return await UserRepository.byId(id)
    };

    create = async ({ username, password, phone, role }: any) => {
        if (!username || typeof username !== "string" || username.trim().length === 0) {
            throw new Error("username is required");
        }

        if (!password || typeof password !== "string" || password.trim().length === 0) {
            throw new Error("password is required");
        }

        if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
            throw new Error("number is required");
        }

        return await UserRepository.save({ username, password, phone, role });
    };

    update = async (id: any, { username, password, phone, role }: any) => {
        if (!this.isUserIdValid(id)) throw Error("No es un id valido");

        //TODO: Agregar validaciones

        return await UserRepository.update(id, { username, password, phone, role });
    }

    delete = async ({ id }: any) => {
        if (!this.isUserIdValid(id)) throw Error("No es un id valido");
        return await UserRepository.delete(id)
    };

    private isUserIdValid = (id: any) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }
}

export default new UserService();