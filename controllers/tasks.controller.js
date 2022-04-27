import tasksService from "./../services/tasks.service.js";

class TasksController {
  async getTasks(request, response) {
    const tasks = await tasksService.getTasks();

    return response.status(200).json(tasks);
  }

  async addTask(request, response) {
    const { title, description } = request.body;

    if (!title || !description) {
      return response.status(404).json("Название или описание не найдены.");
    }

    await tasksService.addTask(title, description);

    return response.status(200).json("Новая задача добавлена.");
  }

  async editTask(request, response) {
    return response.status(200);
  }

  async deleteTask(request, response) {
    return response.status(200);
  }
}

export default new TasksController();
