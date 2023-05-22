TALLER DE EXPRESS CON JSON WEB TOKEN 

En este taller, utilizamos como base el taller de reservas de habitaciones para un hotel. Al aplicar JWT, logramos que el usuario deba iniciar sesión en la aplicación para poder visualizar las habitaciones y las reservas. Esto permite generar un token y acceder a la información de manera segura.

En consiguiente veremos los pasos para generar un nuevo token :

1- Crear un nuevo usuario

Para crear un usuario debemos usar la ruta 

- POST: http://localhost:4000/api/v1/registrar_usuario

Y el objecto :

{
    "nombre": "Jaime",
    "apellido": "Acosta",
    "contraseña": "12345678",
    "correo": "jaime@gmail.com"
}

2- Iniciar sesión con el correo y la contraseña que ingresamos al registrar el usuario

para iniciar sesion en la app utilizaremos la ruta 

- POST: http://localhost:4000/api/v1/login

Y el objecto :

{
    "password": "12345678",
    "email": "jaime@gmail.com"
}

si los datos enviados son correctos no devolvera un objeto con la siguiente estructura :

{
    "errores": "",
    "data": {
        "usuario": {
            "nombres": "Jaime",
            "apellido": "Acosta",
            "estado": 1
        },
        "tokenInfo": {
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Im5vbWJyZXMiOiJKYWltZSIsImFwZWxsaWRvIjoiQWNvc3RhIiwiZXN0YWRvIjoxfSwiY3JlYXRlZEF0IjoxNjg0Nzg3NDg1LCJleHBpcmVkQXQiOjE2ODQ3OTgyODR9.LgGwnyH0n7GQkdVPyH2NVWK5WGD69G3vKJSOxQ_Cdd8",
            "timeBeforeExpiredAt": 1684809384
        }
    }
}

en el objeto llamado tokenInfo obtendremos el token el cual debemos enviar por headers/authorization

en la opcion :

Bearer Token 


VARIABLES DE ENTORNO :


    CONEXIÓN A LA BASE DE DATOS
    
 DB_HOST=bqudkckamwnwpg4znjug-mysql.services.clever-cloud.com
 DB_USER=uu33xtpabqjsu3ra
 DB_PASSWORD=66rcH5oN2Uib7paQkuRl
 DB_DATABASE=bqudkckamwnwpg4znjug
 DB_PORT=3306

SECRET_KEY_JWT=PRIVATE_KEY_JWT


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
