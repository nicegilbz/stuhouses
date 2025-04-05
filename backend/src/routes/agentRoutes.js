const express = require('express');
const agentController = require('../controllers/agentController');
const router = express.Router();

// Get all agents
router.get('/', agentController.getAllAgents);

// Get a single agent by ID
router.get('/:id', agentController.getAgent);

// Get properties by agent ID
router.get('/:id/properties', agentController.getAgentProperties);

module.exports = router; 