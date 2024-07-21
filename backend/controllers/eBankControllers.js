const asyncHandler = require('express-async-handler')
const Card = require('../models/cardModel')
// const moment = require('moment')

const addBank = asyncHandler(async(req,res)=> {
    const {cardNumber,expirationDate,cardholderName,cvv,cardType} = req.body
    if(!cardNumber || !expirationDate || !cardholderName || !cvv || !cardType){
        res.status(400)
        throw new Error("Please enter all the field!")           
    }
    const existCard = await Card.findOne({cardNumber})
    if(existCard){
        res.status(400)
        throw new Error("Card existed!")
    }
    // const inputDate = moment(expirationDate, 'DD-MM-YYYY').startOf('day');
    // const currentDate = moment().startOf('day');
    // if (inputDate.isBefore(currentDate)) {
    //     return res.status(400).send({ message: "Your card has expired!" });
    // }
    const [day, month, year] = expirationDate.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day); // JavaScript months are 0-indexed
    inputDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if(inputDate < currentDate){
        res.status(400)
        throw new Error("Your card has expired!")
    }

    try {
        const bankAccount = await Card.create({
            cardNumber,
            expirationDate,
            cardholderName,
            cvv,
            cardType
        })
        res.status(201).json(bankAccount)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = {
    addBank
}