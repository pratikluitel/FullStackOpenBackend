const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
require("express-async-errors");

usersRouter.get("/", async (requset, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.status(200).json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const body = request.body;
  if (!body.password)
    next({
      name: "ValidationError",
      message: "User validation failed: password: Path `password` is required.",
    });
  if (body.password.length < 3)
    next({ name: "ValidationError", message: "Password too short" });
  const saltRounds = 10;
  const password = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    password,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
