import express from "express";
import reservationsRouter from "../controller/reservationsController.js";
import roomRouter from "../controller/roomController.js";
import usuarioRouter from "../controller/usuarioController.js";

const appRouter = express.Router();

appRouter.use("/", reservationsRouter);
appRouter.use("/", roomRouter);
appRouter.use("/", usuarioRouter);

export default appRouter;
