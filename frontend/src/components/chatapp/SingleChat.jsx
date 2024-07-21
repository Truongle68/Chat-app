import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import { Box, Text } from '@chakra-ui/layout'
import {IconButton} from '@chakra-ui/button'
import {ArrowBackIcon} from '@chakra-ui/icons'
import { getSender } from '../../config/chatLogic'
import UpdateGroupChatModal from './ModalUpdateGroup'
import { Spinner, FormControl, Input } from '@chakra-ui/react'
import { fetchAllMessages, sendMessageFunc } from '../../services/messageServices'
import {toast} from 'react-toastify'
import ScrollableChat from './ScrollableChat'
import './css/style.css'
import { io } from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../../animation/typing.json'

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };

    const {user, selectedChat, setSelectedChat} = ChatState()

    const fetchMessages = async() => {
        if(!selectedChat) return

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const {data} = await fetchAllMessages(selectedChat._id, config)
            setMessages(data)
            
            setLoading(false)
            socket.emit("join chat", selectedChat._id)
            
        } catch (error) {
            toast.error('Fail to fetch message!')
        }
    }

    

    const sendMessage = async(e) => {
        if(e.key === "Enter" && newMessage){
            socket.emit("stop typing", selectedChat._id )
            try {
                const config = {
                    headers: {
                        "Content-type":"application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                
                const {data} = await sendMessageFunc(newMessage, selectedChat._id, config)
                
                socket.emit("new message", data)
                setMessages([...messages, data])

            } catch (error) {
                toast.error('Fail to send message!')
            }
        }
    }

    useEffect(()=>{    
        socket = io(ENDPOINT)
        socket.emit("setup",user)
        socket.on("connected", ()=>setSocketConnected(true))
        socket.on("typing",()=>setIsTyping(true))
        socket.on("stop typing",()=>setIsTyping(false))
    },[])

    useEffect(()=>{
        fetchMessages()

        selectedChatCompare = selectedChat
    },[selectedChat])

    useEffect(()=>{
            
        socket.on("message received", (newMessageReceived)=> {
            if(
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // give notification 
            }else{
                setMessages([...messages, newMessageReceived])
            }
        })
    
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        // Typing Indicator Logic 
        if(!socketConnected) return
        if(!typing){
            setTyping(true)
            socket.emit("typing", selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timeLength = 3000
        setTimeout(()=>{
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timeLength && typing){
                socket.emit("stop typing", selectedChat._id)
                setTyping(false)
            }
        }, timeLength)
    }

  return (
    <>
        {selectedChat ? (
            <>
                <Box
                    fontSize={{base: '28px', md: '30px'}}
                    px={2}
                    pb={3}
                    w='100%'
                    fontFamily='Work sans'
                    display='flex'
                    justifyContent={{base:'space-between'}}
                    alignItems='center'
                >
                    <IconButton
                        display={{base: 'flex', md: 'none'}}
                        icon={<ArrowBackIcon/>}
                        onClick={()=>setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                        </>
                    ) : (
                        <>
                      
                            {selectedChat.chatName.toUpperCase()}
                           
                            
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        </>
                    )}
                </Box>
                <Box
                    display='flex'
                    flexDir='column'
                    justifyContent='flex-end'
                    p={3}
                    bg='#E8E8E8'
                    w='100%'
                    h='100%'
                    borderRadius='lg'
                    overflowY='hidden'
                >
                    {loading ? (
                        <Spinner 
                            size='xl'
                            w={20}
                            h={20}
                            alignSelf='center'
                            margin='auto'
                        />
                    ) : (
                        <div className='messages'>
                            <ScrollableChat messages={messages}/>
                        </div>
                    )}
                    <FormControl onKeyDown={sendMessage}>
                    {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
                        <Input
                            variant='filled'
                            bg='#E0E0E0'
                            marginTop={2}
                            placeholder='Enter a message'
                            value={newMessage}
                            onChange={typingHandler}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                h='100%'
            >
                <Text
                    fontSize='3xl'
                    pb={3}
                    fontFamily='Work sans'
                >
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat