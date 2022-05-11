import tasksService from "./../services/tasks.service.js";

class TasksController {
  async getTasks(request, response) {
    const { payload } = request.body;

    const tasks = await tasksService.getTasks(payload.id);

    return response.status(200).json(tasks);
  }

  async addTask(request, response) {
    const { task, payload } = request.body;

    if (!task.title || !task.description) {
      return response.status(404).json("Название или описание не найдены.");
    }

    return response
      .status(200)
      .json(await tasksService.addTask(payload.id, task));
  }

  async editTask(request, response) {
    const { task, payload } = request.body;

    return response
      .status(200)
      .json(await tasksService.editTask(payload.id, task));
  }

  async deleteTask(request, response) {
    const { id, payload } = request.body;

    return response
      .status(200)
      .json(await tasksService.deleteTask(payload.id, id));
  }
}

export default new TasksController();
