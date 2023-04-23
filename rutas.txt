
DOMINIO : taller-express-myqdl-production.up.railway.app

Para ejecutar las pruebas de las rutas es nesesario añadir el dominio y la ruta a consultar,
como lo podremos ver en el siguiente ejemplo:

https://taller-express-myqdl-production.up.railway.app/api/v1/rooms


objeto de ejemplo 

{
    "codigo_habitacion": "1",
    "nombre": "Jaime",
    "telefono": "3016542625",
    "fecha_reservacion": "2001/01/01",
    "fecha_entrada": "2001/01/01",
    "fecha_salida": "2001/01/01"
}

Rutas de habitaciones en local :

GET : http://localhost:4000/api/v1/rooms : Mostrar todas las habitaciones

GET : http://localhost:4000/api/v1/rooms/1 : Mostrar una habitacion por su codigo


Rutas de reservas en local :

POST : http://localhost:4000/api/v1/bookings : Registrar una reserva

PATCH : http://localhost:4000/api/v1/bookings/2 : Actualizar una reservacion por su codigo

DELETE : http://localhost:4000/api/v1/bookings/2 : Eliminar uan reserva



Rutas de habitaciones en produccion :

GET : https://taller-express-myqdl-production.up.railway.app/api/v1/rooms : Mostrar todas las habitaciones

GET : https://taller-express-myqdl-production.up.railway.app/api/v1/rooms/1 : Mostrar una habitacion por su codigo


Rutas de reservas en produccion :

POST : https://taller-express-myqdl-production.up.railway.app/api/v1/bookings : Registrar una reserva

PATCH : https://taller-express-myqdl-production.up.railway.app/api/v1/bookings/2 : Actualizar una reservacion por su codigo

DELETE : https://taller-express-myqdl-production.up.railway.app/api/v1/bookings/2 : Eliminar uan reserva



