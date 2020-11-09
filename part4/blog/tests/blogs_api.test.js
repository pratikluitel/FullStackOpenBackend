const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./tests_helper");
const Blog = require("../models/blog");
const User = require("../models/user");
const tests_helper = require("./tests_helper");

const bcrypt = require("bcrypt");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  await User.deleteMany({});

  const saltRounds = 10;
  const password = await bcrypt.hash("password", saltRounds);

  const user = new User({
    name: "admin",
    username: "admin",
    password: password,
  });
  await user.save();
});

const api = supertest(app);
describe("returning blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  }, 30000);

  test("there are right number of blogs", async () => {
    const blogs = await helper.blogsinDb();

    expect(blogs).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier is named id", async () => {
    const blogs = await helper.blogsinDb();
    expect(blogs[0].id).toBeDefined();
  });
});

describe("posting blog", () => {
  test("post request creates a new blog", async () => {
    const token = await tests_helper.getToken();
    const newBlog = {
      title: "Fantano",
      author: "Really",
      url:
        "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogs = await helper.blogsinDb();
    const urls = blogs.map((r) => r.url);

    expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
    expect(urls).toContain(
      "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
    );
  });

  test("if likes property does not exist, default value to 0", async () => {
    const token = await tests_helper.getToken();
    const newBlog = {
      title: "Arthur",
      author: "Beowulf",
      url: "https://dummyurl.co.uk",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("if properties are missing from post request, bad request", async () => {
    const token = await tests_helper.getToken();
    const newBlog = {
      author: "Garry",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
  });
  test("fails with status code 401 if token not provided", async () => {
    const newBlog = {
      title: "Arthur",
      author: "Beowulf",
      url: "https://dummyurl.co.uk",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("deletion works", () => {
  test("deletion works on an existing note id with status 204", async () => {
    const token = await tests_helper.getToken();
    const newBlog = {
      title: "Arthur",
      author: "Beowulf",
      url: "https://dummyurl.co.uk",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);

    const blogs = await helper.blogsinDb();
    await api
      .delete(`/api/blogs/${blogs[4].id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const afterDel = await helper.blogsinDb();
    expect(afterDel).toHaveLength(blogs.length - 1);

    const ids = afterDel.map((blog) => blog.id);
    expect(ids).not.toContain(blogs[4].id);
  });
});

describe("adding user works", () => {
  test("invalid users are not created", async () => {
    const newUsers = [
      {
        //short username
        username: "ad",
        name: "admin",
        password: "dadklfj",
      },
      {
        //short password
        username: "admeen",
        name: "admin",
        password: "da",
      },
      {
        //short username and password
        username: "ad",
        name: "admin",
        password: "da",
      },
      {
        //duplicate username
        username: "admin",
        name: "admin",
        password: "dawood",
      },
      {
        //missing username
        name: "admin",
        password: "dawood",
      },
      {
        //missing password
        username: "admeen",
        name: "admin",
      },
    ];
    const promiseArray = newUsers.map((user) =>
      api.post("/api/users").send(user).expect(400)
    );
    await Promise.all(promiseArray);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
