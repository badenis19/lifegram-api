const resolver = {
  // Queries

  // get all posts
  posts: () => {
    return posts;
  },
  // get a specific post based on id
  post: (args) => {
    return posts.filter(p => p.id == args.id)[0];
  },
  // get all users
  users: () => {
    return users;
  },
  // get a specific user based on id
  user: (args) => {
    return users.filter(t => t.id == args.id)[0];
  }
};

module.exports = resolver;