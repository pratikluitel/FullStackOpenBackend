const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./tests_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

const api = supertest(app);

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

test("post request creates a new blog", async () => {
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
  const newBlog = {
    title: "Arthur",
    author: "Beowulf",
    url: "https://dummyurl.co.uk",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(response.body.likes).toBe(0);
});

test("if properties are missing from post request, bad request", async () => {
  const newBlog = {
    author: "Garry",
    likes: 5,
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
