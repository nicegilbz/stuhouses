const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// All admin routes should be protected and require admin role
router.use(protect);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// Content Management Routes
// Properties
router.get('/properties', adminController.getAllProperties);
router.get('/properties/:id', adminController.getProperty);
router.post('/properties', adminController.createProperty);
router.put('/properties/:id', adminController.updateProperty);
router.delete('/properties/:id', adminController.deleteProperty);

// Cities
router.get('/cities', adminController.getAllCities);
router.get('/cities/:id', adminController.getCity);
router.post('/cities', adminController.createCity);
router.put('/cities/:id', adminController.updateCity);
router.delete('/cities/:id', adminController.deleteCity);

// Universities
router.get('/universities', adminController.getAllUniversities);
router.get('/universities/:id', adminController.getUniversity);
router.post('/universities', adminController.createUniversity);
router.put('/universities/:id', adminController.updateUniversity);
router.delete('/universities/:id', adminController.deleteUniversity);

// Agents
router.get('/agents', adminController.getAllAgents);
router.get('/agents/:id', adminController.getAgent);
router.post('/agents', adminController.createAgent);
router.put('/agents/:id', adminController.updateAgent);
router.delete('/agents/:id', adminController.deleteAgent);

// Blog Posts
router.get('/blog', adminController.getAllBlogPosts);
router.get('/blog/:id', adminController.getBlogPost);
router.post('/blog', adminController.createBlogPost);
router.put('/blog/:id', adminController.updateBlogPost);
router.delete('/blog/:id', adminController.deleteBlogPost);

// Users
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Media Library
router.get('/media', adminController.getAllMedia);
router.post('/media/upload', adminController.uploadMedia);
router.delete('/media/:id', adminController.deleteMedia);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router; 