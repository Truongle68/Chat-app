const mongoose = require('mongoose')
const addressSchema = require('../models/addressSchema')

const cardSchema = new mongoose.Schema(
    {
        cardNumber: {
            type: String,
            require: true
        },
        expirationDate: {
            type: String,
            require: true
        },
        cardholderName: {
            type: String,
            require: true,
            trim: true
        },
        cvv: {
            type: String,
            require:true
        },
        cardType: {
            type: String,
            require: true,
            trim: true,
            enum: ['Visa', 'MasterCard', 'American Express', 'Discover']
        },
        // billingAddress: {
        //     address: addressSchema,
        //     state: { type: String, required: true, trim: true },
        //     postalCode: { type: String, required: true, trim: true },
        //     country: { type: String, required: true, trim: true },
        // },
        Customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer"
        }
    },
    {
        timestamps: true
    }
)
const Card = mongoose.model("card", cardSchema)

module.exports = Card

