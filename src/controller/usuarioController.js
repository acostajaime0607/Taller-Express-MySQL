import express from "express";
import { body, validationResult } from "express-validator";
import {
  errorFormatter,
  formatErrorResponse,
  formatErrorValidator,
  formatResponse,
} from "../helper/errorFormatter.js";
import * as bcrypt from "bcrypt";
import connection from "../db.js";
import dayjs from "dayjs";
import es from "dayjs/locale/es.js";
import crearTokenUsuario from "../helper/token.js";

const usuarioRouter = express.Router();

usuarioRouter.post(
  "/registrar_usuario",
  [
    body("nombre").notEmpty().withMessage("El nombre es un campo obligatorio"),
    body("apellido")
      .notEmpty()
      .withMessage("El apellido es un campo obligatorio"),

    body("contraseña")
      .notEmpty()
      .withMessage("La contraseña es un campo obligatorio"),
    body("correo")
      .isEmail()
      .withMessage(
        "Ingrese un email valido, debe contener @ y terminar en .com"
      ),
    body("correo").notEmpty().withMessage("El corro es un campo obligatorio"),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.getConnection();
    await newConnection.beginTransaction();

    try {
      const { nombre, apellido, contraseña, correo } = req.body;

      const day = dayjs().locale(es).format("YYYY/MM/DD HH:mm");

      const [validate] = await newConnection.query(
        "SELECT * FROM usuario_auth WHERE correo= ?",
        [correo]
      );

      if (validate[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Este correo ya se encuentra registrado, por favor intenta con un correo diferente.`
            )
          );
      }

      const [rows] = await newConnection.query(
        "INSERT INTO usuarios(nombres, apellido, estado) VALUES (?, ?, ?)",
        [nombre, apellido, 1]
      );

      const newUsersID = rows.insertId;

      const passwordHast = bcrypt.hashSync(contraseña, 10);

      await newConnection.query(
        "INSERT INTO usuario_auth(fk_usuarios_id, contraseña, correo, fecha_registro) VALUES (?, ?, ?, ?)",
        [newUsersID, passwordHast, correo, day]
      );

      await newConnection.commit();
      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: `Usuario creado con exito.`,
          },
          ""
        )
      );
    } catch (error) {
      console.log(error);
      newConnection.rollback();
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

usuarioRouter.post(
  "/login",
  [
    body("email").notEmpty().withMessage("El email es un campo obligatorio"),
    body("password").notEmpty().withMessage("El email es un campo obligatorio"),
  ],
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.getConnection();

    try {
      const { email, password } = req.body;

      const [existUsers] = await newConnection.query(
        `SELECT * FROM usuario_auth uh
            INNER JOIN usuarios u
            ON uh.fk_usuarios_id = u.id
         WHERE uh.correo= ?`,
        [email]
      );
      if (!existUsers[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `No se encontró ningún usuario asociado al email ingresado, por favor registrese y vuelva a intentarlo.`
            )
          );
      }

      const { contraseña, nombres, apellido, estado } = existUsers[0];

      const isPassword = await bcrypt.compareSync(password, contraseña);

      if (!isPassword) {
        newConnection.release();
        return res
          .status(422)
          .json(formatResponse({}, `Usuario y/o Contraseña incorrectos.`));
      }

      const infoToken = crearTokenUsuario({
        nombres,
        apellido,
        estado,
      });

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            usuario: { nombres, apellido, estado },
            tokenInfo: {
              token: infoToken.token,
              timeBeforeExpiredAt: infoToken.timeBeforeExpiredAt,
            },
          },
          ""
        )
      );
    } catch (error) {
      console.log(error);
      newConnection.release();
      const errorFormated = formatErrorResponse(error);
      return res.status(500).json(errorFormated);
    }
  }
);

export default usuarioRouter;
