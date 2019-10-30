import React, { useState } from 'react'
import { useAuth0 } from '../auth'
import { RefreshToken } from '.'

export const Profile = props => {
  const { loading, user, getRefreshToken, refreshToken } = useAuth0()

  if (loading) return 'Loading...'

  return <main className='flex-center flex-col h-screen'>
    <img className='rounded-full' src={user.picture} />
    <h2 className='text-3xl'>Name: {user.name || user.nickname || user.given_name || user.email || 'No Name'}</h2>
    <RefreshToken className='mt-16' />
  </main>
}
