import React, { useContext } from 'react'
import { UserContext } from '../app'
  
export const UserSelection = () => {
    
    const contextUsers = useContext(UserContext);
    const users = contextUsers.map(user => (
        <option key={`userId: ${user.id}`} value={user.id} >{user.name}</option>
    ))
    return (
        <>
            {users}
        </>
    )
}
