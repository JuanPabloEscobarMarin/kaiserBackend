import { loadFromDisk } from "./src/db/database.js";
import {
  appointments,
  addAppointment,
  getAvailableSlots,
  isAvailable,
  cancelAppointment,
} from "./src/appointments.js";
import { services, addService } from "./src/controllers/services.js";
import { employees, addEmployee } from "./src/controllers/employees.js";

loadFromDisk();

console.log("--- ESTADO INICIAL ---");
console.log(
  `Servicios: ${services.length}, Empleados: ${employees.length}, Citas: ${appointments.length}`,
);

if (services.length === 0) {
  console.log("Configurando datos por primera vez");

  addService({ name: "Corte", price: 35000, time: 60 });
  addService({ name: "Color", price: 90000, time: 90 });

  addEmployee({
    name: "Jorge",
    firstLastName: "Uribe",
    secondLastName: "Perez",
    position: "Barbero",
  });
}

const corte = services.find((s) => s.name === "Corte");
const jorge = employees.find((e) => e.name === "Jorge");

// 3. PRUEBA DE CITAS
console.log("\n--- PRUEBA DE AGENDAMIENTO ---");

// Intentamos agendar una cita
const nuevaCita = addAppointment({
  serviceId: corte.id,
  employeeId: jorge.id,
  startTime: "2026-01-10T16:30:00",
  customerName: "Cliente Test",
  customerIdentification: "1004871033",
});

if (nuevaCita) {
  console.log("✅ Cita agendada con éxito.");
} else {
  console.log("no se pudo agregar");
}

// 4. PRUEBA DE DISPONIBILIDAD
console.log("\n--- VALIDACIÓN DE DISPONIBILIDAD ---");
const ocupado = isAvailable(jorge.id, "2026-01-10T10:30:00", corte.id);

// 5. VER SLOTS DISPONIBLES
console.log("\n--- SLOTS PARA EL DÍA ---");
const slots = getAvailableSlots(jorge.id, corte.id, "2026-01-10");
console.log("Horarios libres encontrados:", slots);
