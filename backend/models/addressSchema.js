const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
    {
        city: {
            type: String, 
            trim: true
        },
        district: {
            type: String, 
            trim: true
        },
        street: {
            type: String, 
            trim: true
        }
    }
)

module.exports = addressSchema