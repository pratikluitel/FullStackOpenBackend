const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./tests_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  let noteObject = new Blog(helper.initialBlogs[0]);
  await noteObject.save();
  noteObject = new Blog(helper.initialBlogs[1]);
  await noteObject.save();
  noteObject = new Blog(helper.initialBlogs[2]);
  await noteObject.save();
  noteObject = new Blog(helper.initialBlogs[3]);
  await noteObject.save();
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

afterAll(() => {
  mongoose.connection.close();
});
