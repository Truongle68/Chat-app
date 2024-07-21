const mongoose = require('mongoose')
const { addressSchema } = require('./addressSchema')

const customerSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            trim: true
        },
        name: {
            type: String,
            require: true,
            trim: true
        },
        phone: {
            type: String,
            require: true,
            trim: true
        },
        address: addressSchema,

    }
)

const Customer = mongoose.model('customer', customerSchema)

module.exports = Customer