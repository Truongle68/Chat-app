import React, { useEffect, useState } from 'react'
import {toast} from 'react-toastify'
import { fetchAllChats } from '../../services/chatServices'
import { ChatState } from '../../context/ChatContext'
import { Box, Stack, Text } from '@chakra-ui/layout'
import {AddIcon} from '@chakra-ui/icons'
import {Button} from '@chakra-ui/react'
import ChatLoading from './ChatLoading'
import { getSender } from '../../config/chatLogic'
import AddModal from './ModalAddNew'


const MyChat = ({fetchAgain}) => {

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
  const [loggedUser, setLoggedUser] = useState()

  const fetchChats = async()=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data} = await fetchAllChats(config)
      console.log(data)
      setChats(data)
    } catch (error) {
      toast.error('Fail to fetch chat!')
    }
  }


  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchChats()
  },[fetchAgain])

  return (
    <Box
      display={{base: selectedChat ? 'none' : "flex", md: "flex"}}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{base: '100%', md : '31%'}}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{base:'28px', md: '30px'}}
        fontFamily='Work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <AddModal>
        <Button
          display='flex'
          fontSize={{base:'17px', md: '10px', lg: '17px'}}
          rightIcon= {<AddIcon/>}
        >
          New Group Chat
        </Button>
        </AddModal>
      </Box>

      <Box
        display='flex'
        flexDir='column'
        w='100%'
        h='100%'
        bg='#F8F8F8'
        p={3}
        borderRadius='lg'
        overflowY='hidden'
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat)=>(
              <Box
                onClick={()=> setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius='lg'
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
                </Text>
              </Box>
            ))}

          </Stack>
        ) : (
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChat