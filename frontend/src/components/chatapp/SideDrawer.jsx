import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {useDisclosure} from '@chakra-ui/hooks'
import React, {  useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import { searchedUser } from '../../services/userService'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { accessChatGroup } from '../../services/chatServices'
import { Spinner } from '@chakra-ui/spinner'

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate= useNavigate()
  const { user, setSelectedChat, chats, setChats } = ChatState()


  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    navigate('/')
  }

  const handleSearch = async() => {
    if(!search){
      toast.error('Enter something to search!')
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };
      const {data} = await searchedUser(search,config) 
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast.error('Fail to load the search result!')
      
    }
  }

  const accessChat = async(userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      };
      const {data} = await accessChatGroup({userId}, config)
      console.log(data)
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast.error('Error fetching the chat')
    }
  }

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        alignContent='center'
        bg='white'
        w='100%'
        p='5px 10px 5px 10px'
        borderWidth='5px'
      >
        <Tooltip hasArrow label='Search places' bg='gray.300' color='black'>
          <Button variant='ghost' onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px='4'>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans' >
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize='2xl' />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' name={user.name} cursor='pointer' />
            </MenuButton>
            <MenuList>
              <MenuItem>My Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>       
      </Box>
      <Drawer 
        placement='left'
        isOpen={isOpen}
        onClose={onClose}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth='1px'>
              Search User
            </DrawerHeader>
            <DrawerBody>
            <Box 
              display='flex'
              pb={2}
            >
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading/>
            ) : (
              searchResult?.map((user)=>(
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction = {()=>accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex'/>}
          </DrawerBody>
          </DrawerContent>
          
        </DrawerOverlay>
      </Drawer>
    </>
  )
}

export default SideDrawer