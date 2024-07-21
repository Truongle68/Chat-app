const express = require('express')
const router = express.Router()

require('dotenv').config()

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data:{
            name: req.body.name,
          },
          unit_amount: req.body.price,
        },
        quantity: req.body.quantity,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  res.send({url: session.url});
});



module.exports = router