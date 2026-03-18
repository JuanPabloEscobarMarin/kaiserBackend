import ServiceRepository from "../repositories/service.repository.ts";

class ServiceService {
    getAll = async () => await ServiceRepository.all();

    getById = async (id: any) => {
        if (!this.isServiceIdValid(id)) throw Error("No es un id valido");

        return await ServiceRepository.byId(id);
    };

    create = async (
        { name, price, duration, state, discount, urlImage, description }: any,
    ) => {
        if (!name || typeof name !== "string" || name.trim().length === 0) {
            throw new Error("name is required");
        }

        if (!price || price === null) {
            throw new Error("price is required");
        }

        return await ServiceRepository.save({
            name,
            price,
            duration,
            state,
            discount,
            urlImage,
            description,
        });
    };

    update = async (
        id: any,
        { name, price, duration, state, discount, urlImage, description }: any,
    ) => {
        if (!this.isServiceIdValid(id)) throw Error("No es un id valido");

        //TODO: Agregar validaciones
        // Agregar validacion de que no haya un appointment AGENDADO con este servicio antes de desactivarlo
        // o de cambiarle el tiempo o el precio

        return await ServiceRepository.update(id, {
            name,
            price,
            duration,
            state,
            discount,
            urlImage,
            description,
        });
    };

    delete = async (id: any) => {
        // Agregar validacion de que no haya un appointment AGENDADO con este servicio antes de borrarlo
        if (!this.isServiceIdValid(id)) throw Error("No es un id valido");
        return await ServiceRepository.delete(id);
    };

    private isServiceIdValid = (id: any) => {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    };
}

export default new ServiceService();
