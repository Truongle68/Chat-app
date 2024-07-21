import React from 'react'
import { Box, Text} from '@chakra-ui/layout'
import { Avatar } from '@chakra-ui/react'

const UserListItem = ({user, handleFunction}) => {

  return (
    <Box
        onClick={handleFunction}
        cursor='pointer'
        bg='#E8E8E8'
        _hover={{
            bg:'#38B2AC',
            color: 'white'
        }}
        w='100%'
        display='flex'
        alignItems='center'
        color='black'
        px={3}
        py={2}
        mb={2}
        borderRadius='lg'
    >
        <Avatar
            size='sm'
            cursor='pointer'
            name={user.name}

        />

        <Box ml='10px'>
            <Text>{user.name}</Text>
            <Text fontSize='xs'>
                <b>Email: </b>
                {user.email}
            </Text>
        </Box>
    </Box>
  )
}

export default UserListItem