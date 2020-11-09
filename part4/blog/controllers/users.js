const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (requset, response) => {
  const users = await User.find({});
  response.status(201).json(users);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  const saltRounds = 10;
  const password = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    password,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
