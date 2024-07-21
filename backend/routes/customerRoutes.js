const express = require('express')
const {protect} = require('../middleware/authMiddleware')

const router = express.Router()

// router.route('/').post(protect, addCustomerInformation)

module.exports = router
