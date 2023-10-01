const express = require('express');
const { register, loginUser, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.get('/me', protect,  getMe);

module.exports = router;