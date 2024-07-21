const express = require('express')
const {authUser, registerUser, allUser} = require('../controllers/userControllers')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/register').post(registerUser)
router.get('/',protect, allUser)
router.post('/login',authUser)

module.exports = router