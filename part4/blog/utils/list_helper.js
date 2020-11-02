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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
