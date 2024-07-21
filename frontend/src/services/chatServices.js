    import axios, { config } from './api'

const accessChatGroup = async({userId}, config) => {
    return await axios.post('/chat',{userId}, config)
}

const fetchAllChats = async(config)=>{
    return await axios.get('/chat',config)
}

const addToGroup = async(groupName, users, config) => {
    return await axios.post('/chat/group', {
        name: groupName,
        users: users
    },config)
}

const addFromGroup = async(chatId, userId, config) => {
    return await axios.put('/chat/groupadd',{
        chatId: chatId,
        userId: userId
    }, config)
}

const renameGroup = async(chatId, chatName, config) => {
    return await axios.put('/chat/rename',{
        chatId: chatId, 
        chatName: chatName
    }, config)
}

const removeFromGroup = async(chatId, userId, config) => {
    return await axios.put('/chat/groupremove',{
        chatId: chatId,
        userId: userId
    },config)
}

export {
    accessChatGroup,
    fetchAllChats,
    addToGroup,
    renameGroup,
    addFromGroup,
    removeFromGroup  
}