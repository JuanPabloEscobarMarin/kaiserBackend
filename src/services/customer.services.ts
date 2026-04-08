import CustomerRepository from "../repositories/customer.repository.ts";

class CustomerService {
  all = async () => CustomerRepository.all();
  byAppointmentId = async (id: any) => {
    const customers = CustomerRepository.byAppointmentId(id);
    return customers;
  };
}

export default new CustomerService();
