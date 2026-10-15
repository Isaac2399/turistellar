import type { LineaHistorial, Oferta } from "@/lib/zona/tipos";

const cafe =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80";
const selva =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80";
const mesa =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";
const cabana =
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80";
const montana =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80";
const costa =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
const pueblo =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80";

export const OFERTAS_SEMILLA: readonly Oferta[] = [
  {
    id: "pz-quesada",
    tipo: "cama",
    titulo: "Cuartos en la finca de café",
    operador: "Familia Quesada",
    lugar: "San Isidro de El General",
    canton: "Pérez Zeledón",
    descripcion:
      "Dos cuartos en la casa de la finca, con desayuno. El visitante se queda en el pueblo, no solo de paso hacia otro destino.",
    precio: "₡28 000 por noche",
    imagen: cafe,
  },
  {
    id: "pz-chirripo",
    tipo: "guia",
    titulo: "Caminata de un día hacia el Chirripó",
    operador: "Guido Mora",
    lugar: "Rivas",
    canton: "Pérez Zeledón",
    descripcion:
      "Salida desde Rivas, sendero y regreso el mismo día. El grupo camina con Guido, no con un operador de San José.",
    precio: "₡35 000 por persona",
    imagen: montana,
  },
  {
    id: "ba-boruca",
    tipo: "comida",
    titulo: "Almuerzo en casa, camino a Boruca",
    operador: "María Lázaro",
    lugar: "Buenos Aires centro",
    canton: "Buenos Aires",
    descripcion:
      "Comida para grupos pequeños que van a la comunidad. La visita queda anotada igual que un tour.",
    precio: "₡8 500 por persona",
    imagen: mesa,
  },
  {
    id: "osa-dos-brazos",
    tipo: "guia",
    titulo: "Recorrido de medio día en Dos Brazos",
    operador: "Eladio Rivera",
    lugar: "Dos Brazos de Río Tigre",
    canton: "Osa",
    descripcion:
      "Camino de la comunidad hacia el monte, con quien vive ahí. Sirve para ver el historial antes de escribirle por el Corcovado.",
    precio: "₡30 000 por persona",
    imagen: selva,
  },
  {
    id: "osa-rancho",
    tipo: "cama",
    titulo: "Noche en Rancho Quemado",
    operador: "Familia Jiménez",
    lugar: "Rancho Quemado",
    canton: "Osa",
    descripcion:
      "Un cuarto y desayuno en la comunidad, antes de seguir a la península. La ficha muestra si ya recibieron a otros visitantes.",
    precio: "₡32 000 por noche",
    imagen: cabana,
  },
  {
    id: "golfito-comedor",
    tipo: "comida",
    titulo: "Almuerzo de grupo en el comedor",
    operador: "Doña Rosa Campos",
    lugar: "Golfito centro",
    canton: "Golfito",
    descripcion:
      "El comedor recibe grupos que bajan del golfo. La parada deja de ser anónima cuando la visita queda a nombre de Rosa.",
    precio: "₡7 500 por persona",
    imagen: costa,
  },
  {
    id: "coto-sanvito",
    tipo: "cama",
    titulo: "Habitación cerca de San Vito",
    operador: "Familia Gamboa",
    lugar: "San Vito",
    canton: "Coto Brus",
    descripcion:
      "Cuarto en casa, para quien recorre Coto Brus y no quiere quedarse solo en el hotel que sale primero.",
    precio: "₡24 000 por noche",
    imagen: pueblo,
  },
  {
    id: "corredores-cuesta",
    tipo: "guia",
    titulo: "Paseo por las fincas de La Cuesta",
    operador: "Héctor Navarro",
    lugar: "La Cuesta",
    canton: "Corredores",
    descripcion:
      "Recorrido corto entre fincas. Todavía no tiene confirmaciones: la ficha sirve para publicar, y el historial aparece cuando un visitante confirme.",
    precio: "₡18 000 por persona",
    imagen: null,
  },
];

export const LINEAS_SEMILLA: readonly LineaHistorial[] = [
  {
    id: "ej-pz-1",
    ofertaId: "pz-quesada",
    fecha: "2026-02-14",
    queSeOfrecio: "Dos noches en la finca de café",
    operador: "Familia Quesada",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-pz-2",
    ofertaId: "pz-quesada",
    fecha: "2026-07-03",
    queSeOfrecio: "Una noche con desayuno",
    operador: "Familia Quesada",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-chirripo",
    ofertaId: "pz-chirripo",
    fecha: "2026-08-16",
    queSeOfrecio: "Caminata de un día hacia el Chirripó",
    operador: "Guido Mora",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-boruca",
    ofertaId: "ba-boruca",
    fecha: "2026-04-09",
    queSeOfrecio: "Almuerzo para cuatro, después de Boruca",
    operador: "María Lázaro",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-brazos",
    ofertaId: "osa-dos-brazos",
    fecha: "2026-03-21",
    queSeOfrecio: "Recorrido de medio día en Dos Brazos",
    operador: "Eladio Rivera",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-rancho",
    ofertaId: "osa-rancho",
    fecha: "2026-06-11",
    queSeOfrecio: "Una noche y desayuno",
    operador: "Familia Jiménez",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-golfito",
    ofertaId: "golfito-comedor",
    fecha: "2026-01-18",
    queSeOfrecio: "Almuerzo para un grupo de seis",
    operador: "Doña Rosa Campos",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
  {
    id: "ej-sanvito",
    ofertaId: "coto-sanvito",
    fecha: "2026-05-02",
    queSeOfrecio: "Dos noches cerca de San Vito",
    operador: "Familia Gamboa",
    origen: "ejemplo",
    cuentaOperador: null,
    cuentaTurista: null,
  },
];
