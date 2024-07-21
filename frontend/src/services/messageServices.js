import axios from './api'

const sendMessageFunc = async(content, chatId, config) => {
    return await axios.post('/message',{
        content:content,
        chatId:chatId,
    }, config)
}

const fetchAllMessages = async(chatId, config) => {
    return await axios.get(`/message/${chatId}`, config)
}

export {
    sendMessageFunc,
    fetchAllMessages
}