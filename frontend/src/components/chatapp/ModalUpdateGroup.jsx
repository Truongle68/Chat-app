import React, { useEffect, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    IconButton,
    useDisclosure,
    Box,
    Input,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { FormControl, Button, Spinner } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatContext'
import UserBadgeItem from './UserBadgeItem'
import { addFromGroup, removeFromGroup, renameGroup} from '../../services/chatServices'
import { toast } from 'react-toastify'
import { searchedUser } from '../../services/userService'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const [groupChatName, setGroupChatName] = useState("")

    const { selectedChat, setSelectedChat, user } = ChatState()

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const handleRemove = async(userToRemove) => {
        if(selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id){
            toast.error('Only admin can remove members!')
            return
        }
        try {
            setLoading(true)
            const {data} = await removeFromGroup(selectedChat._id, userToRemove._id, config)
            userToRemove._id === user._id ? setSelectedChat("") : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast.error('Error occured!')
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        if (!groupChatName) return

        try {
            setRenameLoading(true)
            
            const { data } = await renameGroup(selectedChat._id, groupChatName, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast.error('Fail to rename group name!')
        }
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!search) {
            return
        }
        try {
            setLoading(true)
            const { data } = await searchedUser(search, config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast.error('Fail to load the search result!')
        }
    }
    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.includes(userToAdd)) {
            toast.error('User already in group!')
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) { //logged user is not admin of the group
            toast.error('Only group admin can add members!')
            return
        }
        try {
            setLoading(true)
            const { data } = await addFromGroup(selectedChat._id, userToAdd._id, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)

        } catch (error) {
            toast.error('Error occured!')
            setLoading(false)
        }

    }
    useEffect(() => {
        setGroupChatName(selectedChat.chatName)
    }, [])

    return (
        <div>
            <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                        alignItems='center'

                    >
                        {selectedChat.chatName}


                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl display='flex' mb={3}>
                            <Input
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                mr={3}
                            />
                            <Button
                                variant='outline'
                                colorScheme='green'
                                onClick={handleUpdate}
                                isLoading={renameLoading}
                            >
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Add users eg: Truong, Vy, Hung ,..'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box w='100%' display='flex' flexWrap='wrap'>
                            {selectedChat.users.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <Spinner size='lg' />
                        ) : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' style={{ marginRight: '3px' }} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='solid' colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroupChatModal