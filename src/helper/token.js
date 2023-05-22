import jwt from "jwt-simple";
import moment from "moment";

const crearTokenUsuario = (user) => {
  let date = moment().locale("es");
  let expiredAt = date.add(180, "minutes").unix();

  const payload = {
    user,
    createdAt: moment().locale("es").unix(),
    expiredAt: expiredAt,
  };

  return {
    token: jwt.encode(payload, process.env.SECRET_KEY_JWT),
    timeBeforeExpiredAt: date.add(185, "minutes").unix(),
  };
};

export default crearTokenUsuario;
