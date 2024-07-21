const express = require('express')
const {protect} = require('../middleware/authMiddleware')
const { addBank } = require('../controllers/eBankControllers')

const router =  express.Router()

router.route('/').post(protect, addBank)
// router.route('/updatebank').put(protect,updateBank)
// router.route('/removebank').delete(protect,removeBank)

module.exports = router