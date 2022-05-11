import tokensService from "../services/tokens.service.js";

export default (request, response, next) => {
  const authorizationHeader = request.get("Authorization");
  if (!authorizationHeader) {
    return response.status(401).json('Заголовок "Authorization" не найден.');
  }

  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return response.status(401).json("Токен не найден.");
  }

  const payload = tokensService.verifyAccess(token);
  if (!payload) {
    return response.status(401).json("Токен не валидный.");
  }

  request.body.payload = payload;

  next();
};
