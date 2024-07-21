import React, { useState } from 'react'
import SideDrawer from './SideDrawer'
import { Box } from '@chakra-ui/react'
import MyChat from './MyChat'
import ChatBox from './ChatBox'
import { ChatState } from '../../context/ChatContext'

const ChatPage = () => {
    const {user} = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)

  return (
    <div style={{backgroundColor: '#89d5e3'}}>
        {user && <SideDrawer/>}
        <Box
            display='flex'
            justifyContent='space-between'
            w='100%'
            h='100vh'
            p='10px'
        >
            {user && <MyChat fetchAgain={fetchAgain} />}
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </Box>
    </div>
)
}

export default ChatPage