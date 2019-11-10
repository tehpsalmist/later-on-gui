import React, { useState } from 'react'
import { useAuth0 } from '../auth'
import { RefreshToken, AccessToken } from '.'

export const Profile = props => {
  const { loading, user, getRefreshToken, refreshToken } = useAuth0()

  if (loading) return 'Loading...'

  return <main className='flex-center flex-col'>
    <img className='rounded-full max-w-32 md:max-w-64' src={user.picture} />
    <h2 className='text-3xl'>{user.name || user.nickname || user.given_name || user.email || 'No Name'}</h2>
    <AccessToken className='mt-12 mx-2 max-w-64 md:max-w-sm' />
    <RefreshToken className='mt-12 mx-2 max-w-64 md:max-w-sm' />
  </main>
}
