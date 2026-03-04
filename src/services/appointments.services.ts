import AppointmentRepository from "../repositories/appointment.repository.ts";

class AppointmentService {
    getAll = async () => await AppointmentRepository.all();

    getById = async (id: any) => {
        if (!this.isAppointmentIdValid(id)) throw Error("No es un id valido");

        return await AppointmentRepository.byId(id);
    };
    // TODO: Agregar validacion de que el servicio y el empleado existan antes de crear o actualizar una cita
    // Agregar validacion de que el empleado no tenga otra cita AGENDADA a la misma hora antes de crear o actualizar una cita
    create = async (
        {
            serviceId,
            employeeId,
            state,
        }: any,
    ) => {
        if (
            !serviceId || typeof serviceId !== "string" ||
            serviceId.trim().length === 0
        ) {
            throw new Error("serviceId is required");
        }

        return await AppointmentRepository.save({
            serviceId,
            employeeId,
            state,
        });
    };
    // TODO: Agregar validacion de que el servicio y el empleado existan antes de  actualizar una cita
    // Agregar validacion de que el empleado no tenga otra cita AGENDADA a la misma hora antes de  actualizar una cita
    // Agregar validacion de que no se pueda actualizar una cita que ya paso
    // validar que no se choque con ella misma al actualizarla
    update = async (
        id: any,
        {
            serviceId,
            employeeId,
            state,
        }: any,
    ) => {
        if (!this.isAppointmentIdValid(id)) throw Error("No es un id valido");

        //TODO: Agregar validaciones
        // Agregar validacion de que no haya un appointment AGENDADO con este empleado antes de desactivarlo o borrarlo
        // o de cambiarle el tiempo o el precio

        return await AppointmentRepository.update(id, {
            serviceId,
            employeeId,
            state,
        });
    };

    delete = async (id: any) => {
        // Agregar validacion de que no haya un appointment AGENDADO con este empleado antes de borrarlo
        if (!this.isAppointmentIdValid(id)) throw Error("No es un id valido");
        return await AppointmentRepository.delete(id);
    };
    //TODO : pasar este metodo a utils para no repetirnos
    private isAppointmentIdValid = (id: any) => {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    };

    avalaibleDate = async () => {
        return await AppointmentRepository.availableDate();
    };

    availableDateByDate = async (date: any) => {
        if (!date || typeof date !== "string" || date.trim().length === 0) {
            throw new Error("date is required");
        }

        return await AppointmentRepository.availableDateByDate(date);
    };
}

export default new AppointmentService();
