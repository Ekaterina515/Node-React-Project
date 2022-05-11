import { client } from "./../config/redis.js";
import md5 from "md5";

/**
 * @typedef {{
 * title: string,
 * description: string,
 * id: string;
 * }} Task
 */

class TasksService {
  async getTasks(userId) {
    // Получаем массив с идентификаторами наших задач
    const listOfTasksId = await client.lRange(`tasks:${userId}`, 0, -1);
    console.log(listOfTasksId);
    let tasks = [];

    for (let i = 0; i < listOfTasksId.length; i++) {
      // Получаем хэш задачи по идентификатору из списка в базе данных
      const task = await client.hGetAll(`task:${listOfTasksId[i]}`);
      tasks.push(task);
    }

    return tasks;
  }

  /**
   * @param {Task} task
   */
  async addTask(userId, task) {
    console.log(userId);
    // Генерируем ID для пользователя
    const id = this.generateId(task);
    // Преобразовываем объект в массив
    const taskAsArray = this.getAsArray(task);
    // Создаём новую задачу в базе данных
    await client.hSet(`task:${id}`, taskAsArray);
    // Создаём новый ID в списке с идентификаторами
    await client.rPush(`tasks:${userId}`, id);

    return id;
  }

  /**
   * @param {Task} task
   */
  async editTask(userId, task) {
    // Генерируем текущий ID
    const currentId = this.generateId(task);

    // Если старый ID не равен текущему
    if (task.id !== currentId) {
      // То меняем ID во всей базе данных
      await this.updateIdInDb(task.id, currentId);
      task.id = currentId;
    }

    // Преобразовываем объект в массив
    const taskAsArray = this.getAsArray(task);

    // Сохраняем изменения в задаче
    return await client.hSet(`task:${currentId}`, taskAsArray);
  }

  /**
   * @param {string} oldId
   * @param {string} newId
   */
  async updateIdInDb(userId, oldId, newId) {
    // Переименовываем ID в название хэша
    await client.rename(`task:${oldId}`, `task:${newId}`);
    // Получаем позицию прошлого ID
    const positionId = await client.lPos(`tasks:${userId}`, oldId);
    // Устанавливаем на позицию прошлого ID новый ID
    await client.lSet(`tasks:${userId}`, positionId, newId);
  }

  /**
   * @param {Task} task
   */
  generateId(task) {
    return md5(task.title + task.description);
  }

  /**
   * @param {string} id
   */
  async deleteTask(userId, id) {
    // Удаляем ID из списка и сохраняем результат в переменную
    const removingIdFromList =
      (await client.lRem(`tasks:${userId}`, 0, id)) > 0;
    // Удаляем хэш из базы данных и сохраняем результат в переменную
    const removingTaskHash = (await client.del(`task:${id}`)) > 0;

    // Возвращаем результат удаления
    return removingIdFromList && removingTaskHash;
  }

  getAsArray(object) {
    let objectAsArray = [];
    Object.entries(object).forEach(([key, value]) =>
      objectAsArray.push(key, value)
    );
    return objectAsArray;
  }
}

export default new TasksService();
