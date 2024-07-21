const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const stripe = require('./routes/stripe')
const eBankRoutes = require('./routes/eBankRoutes')
const customerRoutes = require('./routes/customerRoutes')
const {notFound, errorHandler} = require('./middleware/errorMiddleware')


const PORT = process.env.PORT || 4000

connectDB()
app.use(express.json())
app.use(cors())


app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/stripe', stripe)
app.use('/api/bank',eBankRoutes)
app.use('/api/customer',customerRoutes)


app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT,
  console.log(`App running on port ${PORT}`)
)

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000"
  }
})



io.on("connection", (socket)=>{
  console.log(`User Connected: ${socket.id}`)

  socket.on("setup", (userData)=>{
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on("join chat", (room)=>{
    socket.join(room)
    console.log(`User ${socket.id} join the room ${room}`)
  })

  socket.on("typing", (room)=> socket.in(room).emit("typing"))
  socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"))

  socket.on("new message", (newMessageReceived)=>{
    var chat = newMessageReceived.chat

    if(!chat.users)
      return console.log('chat.users are not defined!')

    chat.users.forEach((user)=>{
      if(user._id == newMessageReceived.sender._id)
        return

      console.log(newMessageReceived)
      console.log("chatID: "+ chat._id)
      socket.in(user._id).emit("message received",newMessageReceived)
    })
      
    
  })

})


















