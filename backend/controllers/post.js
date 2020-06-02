const Post = require('../models/post');


exports.createPost =  (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    imagePath: url + "/images/" + req.file.filename,
    author: req.authData.userId
  });
  post.save().then((createdPost) => {
    res.status(201).send({
      message: 'Post Added Successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      },
      author: createdPost.author
    });
  }).catch((e) => {
    res.status(500).send({
      message: 'Creating post failed!'
    });
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let fetchedPost;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery.then(posts => {
    fetchedPost = posts;
    Post.count().then((count) => {
      res.send({
        message: 'Fetched Successfully',
        posts: fetchedPost,
        maxCount: count
      });
    });
  }).catch(err => {
    res.status(500).send({
      message: 'Unable to fetch posts'
    });
  });
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.send(post);
  } else {
    res.status(500).send({
      message: 'Unable to fetch post'
    });
  }
};

exports.updatePost =  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    author: req.authData.userId
  });
  Post.updateOne({_id: req.params.id, author: req.authData.userId}, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: "Update successful!"});
    } else {
      res.status(401).send({
        message: 'Auth Failed'
      });
    }
  }).catch(err => {
    res.status(500).send({
      message: 'Unable to Update post'
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, author: req.authData.userId}).then((result) => {
    if (result.n > 0) {
      res.send({message: 'Removed Successfully'});
    } else {
      res.status(401).send({
        message: 'Auth Failed'
      });
    }
  }).catch(err => {
    res.status(500).send({
      message: 'Unable to delete posts'
    });
  });
};
