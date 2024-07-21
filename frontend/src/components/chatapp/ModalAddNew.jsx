import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  Box
} from '@chakra-ui/react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { ChatState } from '../../context/ChatContext'
import { FormControl } from '@chakra-ui/form-control'
import { searchedUser } from '../../services/userService'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'
import { addToGroup } from '../../services/chatServices'

const AddModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUser, setSelectedUser] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)

  const { user, chats, setChats } = ChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if (!search) {
      return
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await searchedUser(search, config)
      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast.error('Fail to load the search result!')
    }
  }

  const handleSubmit = async() => {
    if(!groupChatName || !selectedUser){
      toast.error('Please fill all the fields')
      return
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const userData = JSON.stringify(selectedUser.map((u) => u._id))
      const {data} = await addToGroup(groupChatName, userData, config)
      setChats([data, ...chats])
      onClose()
      toast.success('Users have been added to group!')
    } catch (error) {
      toast.error('Fail to add users to group!')
    }
  }

  const handleDelete = (deleteUser) => {
    setSelectedUser((preSelectedUser) => preSelectedUser.filter(
      user => user !== deleteUser
    ))    
  }

  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast.error('User already in group!')
      return
    }
    setSelectedUser([...selectedUser, userToAdd])
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDir='column'
            alignItems='center'
          >
            <FormControl>
              <Input
                placeholder='Chat name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder='Add users eg: Truong, Vy, Hung ,..'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w='100%' display='flex' flexWrap='wrap' >
              {selectedUser.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>


            {loading ? <div>loading</div> : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={handleSubmit}>Create chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddModal