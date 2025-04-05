const express = require('express');
const blogController = require('../controllers/blogController');
const router = express.Router();

// Get all blog posts
router.get('/', blogController.getAllPosts);

// Get all blog categories
router.get('/categories', blogController.getCategories);

// Get posts by category
router.get('/categories/:slug', blogController.getPostsByCategory);

// Get featured posts
router.get('/posts/featured', blogController.getFeaturedPosts);

// Get a single blog post by slug (must be last to avoid conflicts)
router.get('/:slug', blogController.getPost);

module.exports = router; 