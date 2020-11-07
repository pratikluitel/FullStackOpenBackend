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
});

test("there are right number of blogs", async () => {
  const blogs = await helper.blogsinDb();

  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

test("unique identifier is named id", async () => {
  const blogs = await helper.blogsinDb();
  expect(blogs[0].id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});
