import express from "express";
import { body, validationResult } from "express-validator";
import {
  errorFormatter,
  formatErrorResponse,
  formatResponse,
} from "../helper/errorFormatter.js";
import connection from "../db.js";
import checkToken from "../helper/checkToken.js";

const roomRouter = express.Router();

// VER TODAS LAS HABITACIONES
roomRouter.get("/rooms", checkToken, async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.getConnection();

  try {
    const [rows] = await newConnection.query("SELECT * FROM habitaciones");

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          message: `Numero de habitaciones obtenidas ${rows.length} `,
          habitaciones: rows,
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
});

// CONSULTAR HABITACION POR CODIGO
roomRouter.get("/rooms/:codigo", checkToken, async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.getConnection();

  try {
    const { codigo } = req.params;

    const [rows] = await newConnection.query(
      "SELECT * FROM habitaciones WHERE codigo= ?",
      [codigo]
    );

    if (!rows[0]) {
      newConnection.release();
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            `No se encontro una habitacion registrada con el codigo : ${codigo}.`
          )
        );
    }

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          message: `Numero de habitaciones obtenidas ${rows.length} `,
          habitaciones: rows,
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
});

roomRouter.delete("/rooms/:codigo", checkToken, async (req, res) => {
  const resultErrors = validationResult(req).formatWith(errorFormatter);
  if (!resultErrors.isEmpty()) {
    const errorResponse = formatErrorValidator(resultErrors);
    return res.status(422).json(formatResponse({}, errorResponse));
  }

  const newConnection = await connection.getConnection();

  try {
    const { codigo } = req.params;

    const [rows] = await newConnection.query(
      "SELECT * FROM habitaciones WHERE codigo= ?",
      [codigo]
    );

    if (!rows[0]) {
      newConnection.release();
      return res
        .status(422)
        .json(
          formatResponse(
            {},
            `No se encontro una habitacion registrada con el codigo : ${codigo}.`
          )
        );
    }

    await newConnection.query(`DELETE FROM habitaciones WHERE codigo= ?`, [
      codigo,
    ]);

    newConnection.release();

    return res.status(201).json(
      formatResponse(
        {
          message: `Habitacion eliminada con exito`,
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
});

roomRouter.post(
  "/rooms",
  [
    body("numero")
      .notEmpty()
      .withMessage("El numero de la habitacion es un campo obligatorio."),
    body("tipo")
      .notEmpty()
      .withMessage("El tipo de la habitacion es un campo obligatorio."),
    body("valor")
      .notEmpty()
      .withMessage("El valor de la habitacion es un campo obligatorio."),
  ],
  checkToken,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.getConnection();

    try {
      const { numero, tipo, valor } = req.body;

      const [rows] = await newConnection.query(
        "SELECT * FROM habitaciones WHERE numero= ?",
        [numero]
      );

      if (rows[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `Ya existe una habitación con el número : ${numero}.`
            )
          );
      }

      const [newRoom] = await newConnection.query(
        `INSERT INTO habitaciones(numero, tipo, valor)
        VALUES(?, ?, ?)
        `,
        [numero, tipo, valor]
      );

      const newRoomID = newRoom.insertId;

      const [data] = await newConnection.query(
        "SELECT * FROM habitaciones WHERE codigo = ?",
        [newRoomID]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: `Habitacion registrada con exito.`,
            newRoom: data[0],
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

roomRouter.put(
  "/rooms/:codigo",
  [
    body("numero")
      .notEmpty()
      .withMessage("El numero de la habitacion es un campo obligatorio."),
    body("tipo")
      .notEmpty()
      .withMessage("El tipo de la habitacion es un campo obligatorio."),
    body("valor")
      .notEmpty()
      .withMessage("El valor de la habitacion es un campo obligatorio."),
  ],
  checkToken,
  async (req, res) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      const errorResponse = formatErrorValidator(resultErrors);
      return res.status(422).json(formatResponse({}, errorResponse));
    }

    const newConnection = await connection.getConnection();

    try {
      const { numero, tipo, valor } = req.body;
      const { codigo } = req.params;

      const [rows] = await newConnection.query(
        "SELECT * FROM habitaciones WHERE codigo= ?",
        [codigo]
      );

      if (!rows[0]) {
        newConnection.release();
        return res
          .status(422)
          .json(
            formatResponse(
              {},
              `No se encontro una habitacion con el codigo : ${codigo}.`
            )
          );
      }

      await newConnection.query(
        `UPDATE habitaciones SET numero= ?, tipo= ?, valor= ? WHERE codigo = ?`,
        [numero, tipo, valor, codigo]
      );

      const [data] = await newConnection.query(
        "SELECT * FROM habitaciones WHERE codigo = ?",
        [codigo]
      );

      newConnection.release();

      return res.status(201).json(
        formatResponse(
          {
            message: `Habitacion registrada con exito.`,
            newRoom: data[0],
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

export default roomRouter;
