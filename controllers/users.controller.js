import usersService from "./../services/users.service.js";

class UsersController {
  async getUser(request, response) {
    const users = await usersService.getUsers();

    return response.status(200).json(users);
  }

  async registration(request, response) {
    const { login, password } = request.body;

    if (!login || !password) {
      return response.status(400).json("Логин или пароль не были введены.");
    }

    if (await usersService.userExists(login)) {
      return response.status(400).json("Логин уже занят.");
    }

    const user = {
      login: login,
      password: password,
    };

    const userAgentHeader = request.get("User-Agent");
    const tokens = await usersService.addUser(user, userAgentHeader);

    response.cookie("refreshToken", tokens.refresh);

    return response.status(200).json({accessToken: tokens.access});
  }

  async authorization(request, response) {
    const { login, password } = request.body;

    if (!login || !password) {
      return response.status(400).json("Логин или пароль не были введены.");
    }

    if (!(await usersService.userExists(login))) {
      return response.status(404).json("Логин или пароль введены неверно.");
    }

    const tokens = await usersService.authUser(
      login,
      password,
      request.get("User-Agent")
    );
    if (!refreshToken) {
      return response.status(404).json("Логин или пароль введены неверно.");
    }

    response.cookie("refreshToken", tokens.refresh);

    return response.status(200).json({accessToken: tokens.access});
  }

  async editUser(request, response) {
    const { user } = request.body;

    return response.status(200).json(await usersService.editUser(user));
  }

  async deleteUser(request, response) {
    const { id } = request.body;

    return response.status(200).json(await usersService.deleteUser(id));
  }
}

export default new UsersController();
