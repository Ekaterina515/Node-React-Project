import { client } from "./../config/redis.js";
import md5 from "md5";

class TasksService {
  async getTasks() {
    // Получаем длину массива с задачами в котором хранятся идентификаторы задач
    const listLength = await client.lLen("tasks");
    let tasks = [];

    for (let i = 0; i < listLength; i++) {
      // Получаем идентификатор задачи из массива по индексу
      const id = await client.lIndex("tasks", i);

      if (!id) {
        throw new Error(`Задача ${id} не найдена.`);
      }

      // Получаем задачу по полученному идентификатору
      tasks.push(await client.hGetAll(`task:${id}`));
    }

    return tasks;
  }

  async addTask(title, description) {
    const dateOfCreate = new Date();
    const id = md5(dateOfCreate);
    const newTaks = await client.hSet(`task:${id}`, [
      ["title", title],
      ["description", description],
      ["dateOfCreate", dateOfCreate],
    ]);

    const listWithId = await client.rPush(`tasks`, id);

    console.log(newTaks);
  }
}

export default new TasksService();
