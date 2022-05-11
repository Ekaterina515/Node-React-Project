import jwt from "jsonwebtoken";
import { client } from "./../config/redis.js";

class TokensService {
  #secretAccess = process.env.SECRET_JWT_ACCESS;
  #secretRefresh = process.env.SECRET_JWT_REFRESH;

  generateAccess(payload) {
    return jwt.sign(payload, this.#secretAccess, { expiresIn: "1h" });
  }

  generateRefresh(payload) {
    return jwt.sign(payload, this.#secretRefresh, { expiresIn: "30d" });
  }

  verifyAccess(token) {
    try {
      return jwt.verify(token, this.#secretAccess);
    } catch (error) {
      return null;
    }
  }

  verifyRefresh(token) {
    try {
      return jwt.verify(token, this.#secretRefresh);
    } catch (error) {
      return null;
    }
  }
}

export default new TokensService();
