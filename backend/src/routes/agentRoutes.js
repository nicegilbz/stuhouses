const express = require('express');
const router = express.Router();

// Temporary placeholder responses
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Agents API is under development',
    data: {
      agents: []
    }
  });
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Agent details API is under development',
    data: {
      agent: null
    }
  });
});

router.get('/:id/properties', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Agent properties API is under development',
    data: {
      properties: []
    }
  });
});

module.exports = router; 