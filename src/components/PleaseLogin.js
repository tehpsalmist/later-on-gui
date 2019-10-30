import React, { useState } from 'react'
import { useAuth0 } from '../auth'
import { useTimeout } from '../hooks'

export const PleaseLogin = ({ authenticating }) => {
  const { loginWithPopup } = useAuth0()
  const [tooLong, setTooLong] = useState(false)

  useTimeout(() => setTooLong(true), 1000)

  return <div className='h-screen flex-center'>
    {!authenticating && tooLong
      ? <button className='p-3 text-2xl text-white rounded bg-blue-400' onClick={() => loginWithPopup({})}>Please Log In</button>
      : <h2 className='text-3xl'>Logging In...</h2>}
  </div>
}
