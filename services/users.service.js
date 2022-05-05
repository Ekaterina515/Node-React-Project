import { client } from "./../config/redis.js";
import md5 from "md5";
import bcrypt from "bcryptjs";
import tokensService from "./tokens.service.js";

/**
 * @typedef {{
 * login: string;
 * password: string;
 * tasksId: string;
 * refreshTokens: string;
 * id: string;
 * }} User
 */

class UsersService {
  /**
   * @param {User} user
   */
  async addUser(user, userAgent) {
    // Генерируем ID для пользователя
    const id = this.generateId(user.login);
    // Хэшируем пароль
    user.password = this.getHashPassword(user.password);
    user.refreshTokens = [
      {
        token: tokensService.generateRefresh(id),
        userAgent: userAgent,
      },
    ];
    // Преобразовываем объект в массив
    const userAsArray = this.getAsArray(user);
    // Создаём новую задачу в базе данных
    await client.hSet(`user:${id}`, userAsArray);
    // Создаём новый ID в списке с идентификаторами
    await client.rPush(`users`, id);

    return id;
  }

  /**
   * @param {string} login
   * @param {string} password
   */
  async findUser(login, password) {
    const id = this.generateId(login);

    const user = await client.hGetAll(`user:${id}`);
    if (!this.validatePassword(password, user.password)) {
      return null;
    }

    return user;
  }

  getHashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
  }

  validatePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  async userExists(login) {
    const id = this.generateId(login);
    return (await client.exists(`user:${id}`)) === 1;
  }

  /**
   * @param {User} user
   */
  async editUser(user) {
    // Преобразовываем объект в массив
    const userAsArray = this.getAsArray(user);

    // Сохраняем изменения в задаче
    return await client.hSet(`user:${user.id}`, userAsArray);
  }

  /**
   * @param {User} user
   */
  generateId(login) {
    return md5(login);
  }

  /**
   * @param {string} id
   */
  async deleteUser(id) {
    // Удаляем ID из списка и сохраняем результат в переменную
    const removingIdFromList = (await client.lRem("users", 0, id)) > 0;
    // Удаляем хэш из базы данных и сохраняем результат в переменную
    const removingUserHash = (await client.del(`user:${id}`)) > 0;

    // Возвращаем результат удаления
    return removingIdFromList && removingUserHash;
  }

  getAsArray(object) {
    let objectAsArray = [];
    Object.entries(object).forEach(([key, value]) => 
      objectAsArray.push(key, typeof(value) === 'object' ? JSON.stringify(value) : value)
    );
    return objectAsArray;
  }
}

export default new UsersService();
