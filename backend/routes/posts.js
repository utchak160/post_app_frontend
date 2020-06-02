const express = require('express');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const postController = require('../controllers/post');

const router = express.Router();

router.post('/api/posts', checkAuth, extractFile.extractFile , postController.createPost);

router.get('/api/posts', postController.getPosts);

router.get('/api/posts/:id', postController.getPost);

router.put('/api/posts/:id', checkAuth, extractFile.extractFile , postController.updatePost);

router.delete('/api/posts/:id', checkAuth, postController.deletePost);

module.exports = router;
