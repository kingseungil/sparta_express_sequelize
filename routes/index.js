const express = require('express');
const router = express.Router();

const postsRouter = require('./posts.routes');
const commentsRouter = require('./comments.routes');
const usersRouter = require('./users.routes');
router.use('/posts/', [postsRouter, commentsRouter, usersRouter]);

module.exports = router;
