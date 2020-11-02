var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;
  else return blogs.reduce((sum, el) => sum + el.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  else {
    const selBlog = blogs.reduce((prev, curr) =>
      curr.likes > prev.likes ? curr : prev
    );
    return {
      title: selBlog.title,
      author: selBlog.author,
      likes: selBlog.likes,
    };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  else {
    const authors = _.uniqBy(blogs, "author").map((blog) => {
      return {
        author: blog.author,
        blogs: blogs.filter((bl) => bl.author === blog.author).length,
      };
    });
    return authors.reduce((prev, curr) =>
      prev.blogs > curr.blogs ? prev : curr
    );
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  else {
    const authors = _.uniqBy(blogs, "author").map((blog) => {
      return {
        author: blog.author,
        likes: totalLikes(blogs.filter((bl) => bl.author === blog.author)),
      };
    });
    return authors.reduce((prev, curr) =>
      prev.likes > curr.likes ? prev : curr
    );
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
