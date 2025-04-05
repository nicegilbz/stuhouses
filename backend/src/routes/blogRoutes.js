const express = require('express');
const router = express.Router();

// Temporary placeholder responses
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Blog API is under development',
    data: {
      posts: []
    }
  });
});

router.get('/:slug', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Blog post API is under development',
    data: {
      post: null
    }
  });
});

router.get('/categories', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Blog categories API is under development',
    data: {
      categories: []
    }
  });
});

router.get('/categories/:slug', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Blog category posts API is under development',
    data: {
      posts: []
    }
  });
});

router.get('/posts/featured', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Featured posts API is under development',
    data: {
      posts: []
    }
  });
});

module.exports = router; 