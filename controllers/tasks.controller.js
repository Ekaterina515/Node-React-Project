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

    return response.status(200).json(await tasksService.addTask(title, description));
  }

  async editTask(request, response) {
    const { task } = request.body;

    return response.status(200).json(await tasksService.editTask(task));
  }

  async deleteTask(request, response) {
    const { id } = request.body;

    return response.status(200).json(await tasksService.deleteTask(id));
  }
}

export default new TasksController();
